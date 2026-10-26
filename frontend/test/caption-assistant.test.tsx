import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CaptionAssistantPage from "@/app/tools/caption-assistant/page";
import { CaptionAssistantStudio } from "@/components/tools/caption-assistant-studio";
import { api } from "@/lib/api/client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/tools/caption-assistant",
  useSearchParams: () => new URLSearchParams(""),
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
    user: { id: "user-1", email: "creator@example.com", name: "Caption Wizard" },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("Caption Assistant Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("1. CaptionAssistantPage renders within DashboardLayout with title and description", () => {
    render(<CaptionAssistantPage />);
    expect(screen.getByText("Caption Assistant Studio")).toBeInTheDocument();
    expect(screen.getByText(/generate high-performing social media captions/i)).toBeInTheDocument();
  });

  it("2. CaptionAssistantStudio renders inputs, platforms, goals, and craft button", () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "Embedded Tech Series",
        description: "IoT and Edge AI projects",
        created_at: "2026-10-02T10:00:00Z",
        updated_at: "2026-10-02T10:00:00Z",
      },
    ]);

    render(<CaptionAssistantStudio />);

    expect(screen.getByText(/caption specifications/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Building an Autonomous IoT Methane/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /craft captions ✦/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load sample/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LinkedIn" })).toBeInTheDocument();
  });

  it("3. Form interaction: clicking Load Sample populates inputs with sample data", () => {
    render(<CaptionAssistantStudio />);

    const loadSampleBtn = screen.getByRole("button", { name: /load sample/i });
    fireEvent.click(loadSampleBtn);

    const topicInput = screen.getByPlaceholderText(/e\.g\. Building an Autonomous IoT Methane/i) as HTMLTextAreaElement;
    expect(topicInput.value).toContain("Autonomous IoT Methane Monitoring System");

    const hookInput = screen.getByPlaceholderText(/e\.g\. Can a \$5 microcontroller/i) as HTMLInputElement;
    expect(hookInput.value).toContain("Can a $5 microcontroller");
  });

  it("4. Displays error banner when caption generation request fails", async () => {
    vi.spyOn(api.tools, "generateCaption").mockRejectedValue(new Error("Gemini Service connection timeout"));

    render(<CaptionAssistantStudio />);

    const loadSampleBtn = screen.getByRole("button", { name: /load sample/i });
    fireEvent.click(loadSampleBtn);

    const craftBtn = screen.getByRole("button", { name: /craft captions ✦/i });
    fireEvent.click(craftBtn);

    await waitFor(() => {
      expect(screen.getByText(/gemini service connection timeout/i)).toBeInTheDocument();
    });
  });

  it("5. Renders generated multi-take captions, recommended badge, reach score, hashtags, and project persistence badge", async () => {
    const mockResponse = {
      generation_id: "gen-cap-1234",
      project_id: "proj-1",
      topic: "Autonomous IoT Methane Monitoring System using ESP32",
      platform: "Instagram",
      tone: "Engaging",
      caption_length: "Medium",
      caption: {
        caption: "Can a $5 microcontroller prevent an industrial catastrophe?\n\nMost plants rely on costly cloud setups. By running TinyML on ESP32, we cut alert latency to milliseconds.\n\nWould you deploy edge AI for critical infra? Drop your thoughts below!\n\n#IoT #EdgeAI #EmbeddedSystems",
        hook: "Can a $5 microcontroller prevent an industrial catastrophe?",
        body: "Most plants rely on costly cloud setups. By running TinyML on ESP32, we cut alert latency to milliseconds.",
        call_to_action: "Would you deploy edge AI for critical infra? Drop your thoughts below!",
        hashtags: ["IoT", "EdgeAI", "EmbeddedSystems"],
        platform: "Instagram",
        tone: "Engaging",
        content_goal: "Saves",
        caption_length: "Medium",
        character_count: 245,
        variants: [
          {
            label: "Take 1: Story-Led Technical Journey",
            hook: "Can a $5 microcontroller prevent an industrial catastrophe?",
            body: "Most plants rely on costly cloud setups. By running TinyML on ESP32, we cut alert latency to milliseconds.",
            cta: "Would you deploy edge AI for critical infra? Drop your thoughts below!",
            hashtags: ["IoT", "EdgeAI", "EmbeddedSystems"],
            keywords: ["edge anomaly detection"],
            reach_score: 95,
            why: "Contrasts cost with high impact, hooking engineering audiences instantly.",
            extra: "Reel audio tip: Use an ambient lo-fi synth track."
          },
          {
            label: "Take 2: Direct Problem-Solution Hook",
            hook: "Why traditional methane monitors fail in field deployments.",
            body: "Cloud lag is dangerous when leaks happen. Local edge inference flags anomalies immediately.",
            cta: "Bookmark this breakdown for your next IoT build.",
            hashtags: ["Microcontrollers", "HardwareEngineering"],
            keywords: ["low latency telemetry"],
            reach_score: 88,
            why: "Direct urgency hook ideal for bookmarking saves.",
            extra: "Carousel tip: Slide 1 should display hardware pinout."
          }
        ],
        recommended_variant_index: 0,
        recommend_reason: "Take 1 has the highest curiosity hook and strongest comment conversion prompt.",
        planning_trace: "Analyzed audience for technical credibility and save intent."
      },
      usage: {
        input_tokens: 150,
        output_tokens: 220,
        total_tokens: 370,
        latency_ms: 1240
      },
      metadata: {
        topic: "Autonomous IoT Methane Monitoring System using ESP32",
        platform: "Instagram",
        tone: "Engaging",
        hook_preserved: true,
        variant_count: 2,
        is_grounded: true
      }
    };

    vi.spyOn(api.tools, "generateCaption").mockResolvedValue(mockResponse);

    render(<CaptionAssistantStudio />);

    const loadSampleBtn = screen.getByRole("button", { name: /load sample/i });
    fireEvent.click(loadSampleBtn);

    const craftBtn = screen.getByRole("button", { name: /craft captions ✦/i });
    fireEvent.click(craftBtn);

    await waitFor(() => {
      // Recommendation callout
      expect(screen.getByText(/★ recommended take: take 1/i)).toBeInTheDocument();
      expect(screen.getByText(/take 1 has the highest curiosity hook/i)).toBeInTheDocument();

      // Multi-take variant cards
      expect(screen.getByText("Take 1: Story-Led Technical Journey")).toBeInTheDocument();
      expect(screen.getByText("Take 2: Direct Problem-Solution Hook")).toBeInTheDocument();

      // Reach Score
      expect(screen.getByText("95%")).toBeInTheDocument();

      // Hashtags
      expect(screen.getByText("#IoT")).toBeInTheDocument();
      expect(screen.getByText("#EdgeAI")).toBeInTheDocument();

      // Project persistence badge
      expect(screen.getByText(/persisted to project as asset/i)).toBeInTheDocument();
    });
  });

  it("6. Copy button triggers navigator.clipboard.writeText with caption text", async () => {
    const mockResponse = {
      generation_id: "gen-cap-1234",
      topic: "ESP32 Methane Detection",
      platform: "Instagram",
      tone: "Engaging",
      caption_length: "Medium",
      caption: {
        caption: "Full publishable caption text here.",
        hook: "Can a $5 microcontroller prevent an industrial catastrophe?",
        body: "Local edge processing detects gas spikes in milliseconds.",
        call_to_action: "Follow for part two!",
        hashtags: ["IoT"],
        platform: "Instagram",
        tone: "Engaging",
        content_goal: "Engagement",
        caption_length: "Medium",
        character_count: 120,
        variants: [
          {
            label: "Take 1: Story-Led",
            hook: "Can a $5 microcontroller prevent an industrial catastrophe?",
            body: "Local edge processing detects gas spikes in milliseconds.",
            cta: "Follow for part two!",
            hashtags: ["IoT"],
            keywords: ["edge AI"],
            reach_score: 92,
            why: "Engaging hook with clear payoff.",
            extra: null
          }
        ],
        recommended_variant_index: 0,
        recommend_reason: "Best reach potential."
      },
      usage: { latency_ms: 800 },
      metadata: { is_grounded: true }
    };

    vi.spyOn(api.tools, "generateCaption").mockResolvedValue(mockResponse);

    render(<CaptionAssistantStudio />);

    const loadSampleBtn = screen.getByRole("button", { name: /load sample/i });
    fireEvent.click(loadSampleBtn);

    const craftBtn = screen.getByRole("button", { name: /craft captions ✦/i });
    fireEvent.click(craftBtn);

    await waitFor(() => {
      expect(screen.getByText("Take 1: Story-Led")).toBeInTheDocument();
    });

    const copyBtn = screen.getAllByRole("button", { name: /copy caption/i })[0];
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
