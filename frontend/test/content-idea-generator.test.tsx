import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContentIdeaGeneratorPage from "@/app/tools/content-idea-generator/page";
import { ContentIdeaGeneratorStudio } from "@/components/tools/content-idea-generator-studio";
import { api } from "@/lib/api/client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/tools/content-idea-generator",
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
    user: { id: "user-1", email: "creator@example.com", name: "Innovator" },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("Content Idea Generator Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. ContentIdeaGeneratorPage renders within DashboardLayout with title and breadcrumbs", () => {
    render(<ContentIdeaGeneratorPage />);
    expect(screen.getByText("Content Idea Generator Studio")).toBeInTheDocument();
    expect(screen.getByText(/brainstorm viral, niche-targeted content concepts/i)).toBeInTheDocument();
  });

  it("2. ContentIdeaGeneratorStudio renders form controls, buttons, and sample loader", () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "IoT Research",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    render(<ContentIdeaGeneratorStudio initialProjectId="proj-1" />);

    expect(screen.getByText("Content Idea Generator")).toBeInTheDocument();
    expect(screen.getByText("Load Sample")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Building an Autonomous IoT Methane Monitoring System/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate content ideas/i })).toBeInTheDocument();
    expect(screen.getByText("Ready to Ideate")).toBeInTheDocument();
  });

  it("3. Form interaction: clicking Load Sample populates inputs", () => {
    render(<ContentIdeaGeneratorStudio />);

    const loadSampleBtn = screen.getByText("Load Sample");
    fireEvent.click(loadSampleBtn);

    const textarea = screen.getByPlaceholderText(/e\.g\. Building an Autonomous IoT Methane Monitoring System/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("Methane Monitoring System");
  });

  it("4. Displays error banner when generation request fails", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([]);
    vi.spyOn(api.tools, "generateContentIdeas").mockRejectedValue(
      new Error("Gemini Structured Service rate limit exceeded")
    );

    render(<ContentIdeaGeneratorStudio />);

    // Load sample and click generate
    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate content ideas/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Gemini Structured Service rate limit exceeded/i)).toBeInTheDocument();
    });
  });

  it("5. Renders generated structured ideas, hooks, badges, and project saved indicator", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "IoT Hardware Series",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    vi.spyOn(api.tools, "generateContentIdeas").mockResolvedValue({
      generation_id: "gen-abc-123",
      project_id: "proj-1",
      ideas: [
        {
          title: "How I Built a Low-Cost Methane Detector with ESP32",
          idea: "Technical teardown of hardware sensor calibration and telemetry.",
          hook: "Most developers think gas sensors cost thousands. Here is how I built one for $15.",
          description: "Step-by-step schematic walkthrough and edge AI filtering overview.",
          target_audience: "Makers and embedded engineers",
          platform: "YouTube",
          rationale: "Extreme curiosity gap combined with DIY accessibility drives massive CTR.",
        },
        {
          title: "5 Hardware Traps to Avoid When Deploying IoT Sensors",
          idea: "Field experience and lessons learned from outdoor deployment.",
          hook: "I left an ESP32 sensor outside for 30 days. Everything went wrong.",
          description: "Troubleshooting power management, moisture, and antenna attenuation.",
          target_audience: "Founders and hardware engineers",
          platform: "LinkedIn",
          rationale: "First-person failure case studies generate high engagement on professional feeds.",
        },
      ],
      summary: "High-retention concepts centered on IoT hardware engineering.",
      usage: {
        input_tokens: 150,
        output_tokens: 280,
        total_tokens: 430,
        latency_ms: 850,
      },
      metadata: {
        number_of_ideas: 2,
      },
    });

    render(<ContentIdeaGeneratorStudio initialProjectId="proj-1" />);

    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate content ideas/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText("How I Built a Low-Cost Methane Detector with ESP32")).toBeInTheDocument();
      expect(screen.getByText(/"Most developers think gas sensors cost thousands\. Here is how I built one for \$15\."/)).toBeInTheDocument();
      expect(screen.getByText("5 Hardware Traps to Avoid When Deploying IoT Sensors")).toBeInTheDocument();
      expect(screen.getByText("Saved to Project")).toBeInTheDocument();
      expect(screen.getByText("High-retention concepts centered on IoT hardware engineering.")).toBeInTheDocument();
    });
  });
});
