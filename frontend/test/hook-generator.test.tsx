import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HookGeneratorPage from "@/app/tools/hook-generator/page";
import { HookGeneratorStudio } from "@/components/tools/hook-generator-studio";
import { api } from "@/lib/api/client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/tools/hook-generator",
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
    user: { id: "user-1", email: "creator@example.com", name: "Hook Master" },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("Hook Generator Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. HookGeneratorPage renders within DashboardLayout with title and description", () => {
    render(<HookGeneratorPage />);
    expect(screen.getByText("Hook Generator Studio")).toBeInTheDocument();
    expect(screen.getByText(/tailored to 10 psychological angles/i)).toBeInTheDocument();
  });

  it("2. HookGeneratorStudio renders inputs, platforms, frameworks, and generate button", () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "IoT Hardware Series",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    render(<HookGeneratorStudio initialProjectId="proj-1" />);

    expect(screen.getByText("Hook Generator")).toBeInTheDocument();
    expect(screen.getByText("Load Sample")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Building an Autonomous IoT Methane Monitoring System/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate 10 hooks/i })).toBeInTheDocument();
    expect(screen.getByText("Ready to Hook Your Audience")).toBeInTheDocument();
  });

  it("3. Form interaction: clicking Load Sample populates inputs with sample data", () => {
    render(<HookGeneratorStudio />);

    const loadSampleBtn = screen.getByText("Load Sample");
    fireEvent.click(loadSampleBtn);

    const topicTextarea = screen.getByPlaceholderText(/e\.g\. Building an Autonomous IoT Methane Monitoring System/i) as HTMLTextAreaElement;
    expect(topicTextarea.value).toContain("Methane Monitoring System");
  });

  it("4. Displays error banner when hook generation request fails", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([]);
    vi.spyOn(api.tools, "generateHooks").mockRejectedValue(
      new Error("Central Gemini Service rate limit error")
    );

    render(<HookGeneratorStudio />);

    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate 10 hooks/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Central Gemini Service rate limit error/i)).toBeInTheDocument();
    });
  });

  it("5. Renders generated hooks across 10 frameworks with project persistence indicator", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "IoT Hardware Series",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    vi.spyOn(api.tools, "generateHooks").mockResolvedValue({
      generation_id: "gen-hook-999",
      project_id: "proj-1",
      topic: "Building an Autonomous IoT Methane Monitoring System using ESP32",
      platform: "all",
      tone: "bold",
      hooks: [
        {
          id: 1,
          style: "Curiosity",
          hook: "There is an unspoken engineering secret about ESP32 methane monitors that changes everything.",
          platform: "YouTube",
          rationale: "Curiosity gap hooks viewers into technical breakdown.",
        },
        {
          id: 2,
          style: "Contrarian",
          hook: "Stop paying $500 for industrial gas monitors when a $15 ESP32 can detect leaks autonomously.",
          platform: "LinkedIn",
          rationale: "Attacking high costs disrupts expectations on professional feeds.",
        },
      ],
      usage: {
        input_tokens: 180,
        output_tokens: 220,
        total_tokens: 400,
        latency_ms: 650,
      },
      metadata: {
        number_of_hooks: 2,
      },
    });

    render(<HookGeneratorStudio initialProjectId="proj-1" />);

    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate 10 hooks/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/There is an unspoken engineering secret about ESP32 methane monitors/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Stop paying \$500 for industrial gas monitors/i)
      ).toBeInTheDocument();
      expect(screen.getByText("Saved to Project")).toBeInTheDocument();
      expect(screen.getAllByText("Curiosity").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Contrarian").length).toBeGreaterThan(0);
    });
  });
});
