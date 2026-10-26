import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { ContentRepurposerStudio } from "@/components/tools/content-repurposer-studio";
import { api } from "@/lib/api/client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock Auth Context
vi.mock("@/lib/auth/auth-context", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@example.com", name: "Test Creator" },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("Frontend Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. LoginPage renders branding, inputs, and submit button", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("creator@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("2. CreateProjectModal renders inputs and handles project creation", async () => {
    const handleCreated = vi.fn();
    const handleClose = vi.fn();

    vi.spyOn(api.projects, "create").mockResolvedValue({
      id: "proj-123",
      user_id: "user-1",
      name: "New AI Project",
      description: "Sample description",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    render(
      <CreateProjectModal
        isOpen={true}
        onClose={handleClose}
        onCreated={handleCreated}
      />
    );

    expect(screen.getByText("Create New Project")).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText(/AI Engineering Roadmap 2026/i);
    fireEvent.change(nameInput, { target: { value: "New AI Project" } });

    const submitBtn = screen.getByRole("button", { name: /create project/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleCreated).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New AI Project" })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("3. ContentRepurposerStudio renders inputs, platforms, and tones", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "Main Campaign",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    render(<ContentRepurposerStudio initialProjectId="proj-1" />);

    expect(screen.getByText("Content Repurposer")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("X (Twitter)")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("YouTube Video")).toBeInTheDocument();
    expect(screen.getByText("Load Sample")).toBeInTheDocument();
  });

  it("4. ContentRepurposerStudio displays error state when submission fails", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "Main Campaign",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    vi.spyOn(api.tools, "repurposeContent").mockRejectedValue(
      new Error("AI Model Gateway timeout error")
    );

    render(<ContentRepurposerStudio initialProjectId="proj-1" />);

    // Load sample text
    const sampleBtn = screen.getByText("Load Sample");
    fireEvent.click(sampleBtn);

    const generateBtn = screen.getByRole("button", {
      name: /repurpose across platforms/i,
    });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/AI Model Gateway timeout error/i)
      ).toBeInTheDocument();
    });
  });

  it("5. ContentRepurposerStudio renders successful outputs across selected platforms", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "Main Campaign",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    vi.spyOn(api.tools, "repurposeContent").mockResolvedValue({
      generation_id: "gen-999",
      project_id: "proj-1",
      results: {
        linkedin: "Generated LinkedIn thought-leadership post content.",
        x: "Generated concise X tweet thread.",
      },
      usage: {
        input_tokens: 100,
        output_tokens: 150,
        total_tokens: 250,
      },
    });

    render(<ContentRepurposerStudio initialProjectId="proj-1" />);

    const sampleBtn = screen.getByText("Load Sample");
    fireEvent.click(sampleBtn);

    const generateBtn = screen.getByRole("button", {
      name: /repurpose across platforms/i,
    });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Generated LinkedIn thought-leadership post content.")
      ).toBeInTheDocument();
      expect(screen.getByText("Saved to Project")).toBeInTheDocument();
    });
  });

  it("6. ApiClient includes Bearer token when valid and ignores undefined/null", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "healthy", service: "Creator AI" }),
    } as any);

    // Test with undefined in localStorage
    localStorage.setItem("token", "undefined");
    await api.getHealth();
    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: "Bearer undefined",
        }),
      })
    );

    // Test with real valid token in localStorage
    localStorage.setItem("token", "valid_jwt_token_sample");
    await api.getHealth();
    expect(fetchSpy).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer valid_jwt_token_sample",
        }),
      })
    );

    localStorage.removeItem("token");
  });
});
