import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReelScriptBuilderPage from "@/app/tools/reel-script-builder/page";
import { ReelScriptBuilderStudio } from "@/components/tools/reel-script-builder-studio";
import { api } from "@/lib/api/client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/tools/reel-script-builder",
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
    user: { id: "user-1", email: "creator@example.com", name: "Reel Master" },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("Reel Script Builder Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("1. ReelScriptBuilderPage renders within DashboardLayout with title and description", () => {
    render(<ReelScriptBuilderPage />);
    expect(screen.getByText("Reel Script Builder Studio")).toBeInTheDocument();
    expect(screen.getByText(/build high-retention short-form video scripts/i)).toBeInTheDocument();
  });

  it("2. ReelScriptBuilderStudio renders inputs, platforms, duration, and generate button", () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "Hardware Reels Series",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    render(<ReelScriptBuilderStudio initialProjectId="proj-1" />);

    expect(screen.getByText("Reel Script Builder")).toBeInTheDocument();
    expect(screen.getByText("Load Sample")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Autonomous IoT Methane Monitoring System/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate reel script/i })).toBeInTheDocument();
    expect(screen.getByText("Ready to Build Your Reel")).toBeInTheDocument();
  });

  it("3. Form interaction: clicking Load Sample populates inputs with sample data", () => {
    render(<ReelScriptBuilderStudio />);

    const loadSampleBtn = screen.getByText("Load Sample");
    fireEvent.click(loadSampleBtn);

    const topicTextarea = screen.getByPlaceholderText(/e\.g\. Autonomous IoT Methane Monitoring System/i) as HTMLTextAreaElement;
    expect(topicTextarea.value).toContain("Methane Monitoring System");

    const hookInput = screen.getByPlaceholderText(/e\.g\. Can a \$5 microcontroller/i) as HTMLInputElement;
    expect(hookInput.value).toContain("microcontroller");
  });

  it("4. Displays error banner when script generation request fails", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([]);
    vi.spyOn(api.tools, "generateReelScript").mockRejectedValue(
      new Error("Gemini Service connection timeout")
    );

    render(<ReelScriptBuilderStudio />);

    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate reel script/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Gemini Service connection timeout/i)).toBeInTheDocument();
    });
  });

  it("5. Renders generated 3-part script, timeline scenes, visuals, dialogue, CTA, and project saved badge", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([
      {
        id: "proj-1",
        user_id: "user-1",
        name: "Hardware Reels Series",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    vi.spyOn(api.tools, "generateReelScript").mockResolvedValue({
      generation_id: "gen-reel-123",
      project_id: "proj-1",
      topic: "Autonomous IoT Methane Monitoring System using ESP32",
      platform: "instagram",
      tone: "engaging",
      duration: "30-60s",
      script: {
        title: "How to Build a $15 Methane Detector with ESP32",
        hook: "Can a $5 microcontroller really detect industrial methane leaks faster than a cloud server?",
        body: "Instead of relying on fragile cloud APIs, you can process sensor telemetry right on the edge with local anomaly models. This cuts alert latency down to milliseconds and prevents false alarms from internet dropouts.",
        cta: "Want the full wiring diagram and code repository for ESP32 methane monitoring? Drop a comment below and follow for part two.",
        duration: "30-60s",
        scenes: [
          {
            scene_number: 1,
            timestamp: "0:00 - 0:05",
            dialogue: "Can a $5 microcontroller really detect industrial methane leaks faster than a cloud server?",
            visual_direction: "Extreme close-up on hardware prototype. Quick snap zoom to speaker.",
            on_screen_text: "LOCAL EDGE PROCESSING",
          },
          {
            scene_number: 2,
            timestamp: "0:05 - 0:25",
            dialogue: "Instead of relying on fragile cloud APIs, you can process sensor telemetry right on the edge.",
            visual_direction: "B-roll montage showing logic analyzer traces and live serial monitor debugging.",
            on_screen_text: "ZERO CLOUD DEPENDENCY",
          },
          {
            scene_number: 3,
            timestamp: "0:25 - 0:50",
            dialogue: "This cuts alert latency down to milliseconds and prevents false alarms from internet dropouts.",
            visual_direction: "Overhead bench shot pointing directly to sensor pinout and microcontroller GPIO.",
            on_screen_text: "MILLISECOND ALERTS",
          },
          {
            scene_number: 4,
            timestamp: "0:50 - 1:00",
            dialogue: "Want the full wiring diagram and code repository? Drop a comment below and follow for part two.",
            visual_direction: "Direct-to-camera engaging smile with pointing gesture down toward comments.",
            on_screen_text: "COMMENT FOR SCHEMATICS",
          },
        ],
        caption_suggestion: "Full teardown of ESP32 autonomous methane monitoring. Link to repository in bio! #IoT #Hardware #EdgeAI",
        estimated_word_count: 110,
        thoughts: [
          "Analyzed topic for high-retention technical framing.",
          "Adopted pre-existing hook into scene 1 opener.",
          "Structured 4 clear visual beats within 60 seconds.",
        ],
      },
      usage: {
        input_tokens: 210,
        output_tokens: 380,
        total_tokens: 590,
        latency_ms: 780,
      },
      metadata: {
        hook_preserved: true,
      },
    });

    render(<ReelScriptBuilderStudio initialProjectId="proj-1" />);

    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate reel script/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      // Title
      expect(screen.getByText("How to Build a $15 Methane Detector with ESP32")).toBeInTheDocument();
      // Saved to Project
      expect(screen.getByText("Saved to Project")).toBeInTheDocument();
      // Hook section
      expect(screen.getByText("Hook 0 - 5 s")).toBeInTheDocument();
      expect(screen.getAllByText(/Can a \$5 microcontroller really detect/i).length).toBeGreaterThan(0);
      // Timeline scenes
      expect(screen.getByText("Scene 1")).toBeInTheDocument();
      expect(screen.getByText("Scene 2")).toBeInTheDocument();
      expect(screen.getByText("Scene 3")).toBeInTheDocument();
      expect(screen.getByText("Scene 4")).toBeInTheDocument();
      // On screen text
      expect(screen.getByText(/LOCAL EDGE PROCESSING/i)).toBeInTheDocument();
      expect(screen.getByText(/ZERO CLOUD DEPENDENCY/i)).toBeInTheDocument();
      // CTA section
      expect(screen.getByText("CTA 50 - 60 s")).toBeInTheDocument();
      // Copy button
      expect(screen.getByRole("button", { name: /copy script/i })).toBeInTheDocument();
    });
  });

  it("6. Copy interaction copies full script to clipboard", async () => {
    vi.spyOn(api.projects, "list").mockResolvedValue([]);
    vi.spyOn(api.tools, "generateReelScript").mockResolvedValue({
      generation_id: "gen-reel-123",
      topic: "Autonomous IoT Methane Monitoring System using ESP32",
      platform: "instagram",
      tone: "engaging",
      duration: "30-60s",
      script: {
        title: "ESP32 Methane Detector",
        hook: "Can a $5 microcontroller detect gas leaks?",
        body: "Here is how it works on the edge.",
        cta: "Follow for more hardware tutorials.",
        duration: "30-60s",
        scenes: [
          {
            scene_number: 1,
            timestamp: "0:00 - 0:05",
            dialogue: "Can a $5 microcontroller detect gas leaks?",
            visual_direction: "Close up shot.",
          },
        ],
      },
      usage: { latency_ms: 500 },
      metadata: {},
    });

    render(<ReelScriptBuilderStudio />);

    fireEvent.click(screen.getByText("Load Sample"));
    const generateBtn = screen.getByRole("button", { name: /generate reel script/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy script/i })).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole("button", { name: /copy script/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
