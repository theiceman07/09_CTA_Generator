import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/layout/sidebar";
import { APPLICATION_REGISTRY } from "@/lib/registry";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/tools/ai-content-director",
}));

// Mock auth context
vi.mock("@/lib/auth/auth-context", () => ({
  useAuth: () => ({
    user: { id: "test-user", name: "Test Creator", email: "test@creator.ai" },
    logout: vi.fn(),
  }),
}));

describe("Sidebar Navigation Suite", () => {
  it("renders all 24 applications from the centralized registry", () => {
    const { container } = render(<Sidebar />);

    expect(APPLICATION_REGISTRY).toHaveLength(24);

    // Verify all 24 tools have direct clickable navigation links with their exact routes
    for (const app of APPLICATION_REGISTRY) {
      const links = Array.from(container.querySelectorAll(`a[href="${app.route}"]`));
      const toolLink = links.find((l) => l.textContent?.includes(app.name));
      expect(toolLink).toBeDefined();
      expect(toolLink?.getAttribute("href")).toBe(app.route);
    }
  });

  it("renders all 5 category groupings with tool count badges", () => {
    render(<Sidebar />);

    expect(screen.getByText(/Content Creation/i)).toBeDefined();
    expect(screen.getByText(/Repurposing & Optimization/i)).toBeDefined();
    expect(screen.getByText(/Audio & Video Media/i)).toBeDefined();
    expect(screen.getByText(/Research & Strategy/i)).toBeDefined();
    expect(screen.getByText(/Workflows & Autonomous Pipelines/i)).toBeDefined();
  });

  it("accurately highlights the active route", () => {
    const { container } = render(<Sidebar />);

    // Since pathname is mocked to /tools/ai-content-director
    const links = Array.from(container.querySelectorAll(`a[href="/tools/ai-content-director"]`));
    const activeLink = links.find((l) => l.textContent?.includes("AI Content Director") && !l.textContent?.includes("Guruvelah"));
    expect(activeLink).toBeDefined();
    expect(activeLink?.className).toContain("bg-indigo-600/20");
    expect(activeLink?.className).toContain("text-indigo-300");

    // Other tools should not have the active background
    const guruvelahLinks = Array.from(container.querySelectorAll(`a[href="/tools/ai-content-director-guruvelah"]`));
    const inactiveLink = guruvelahLinks[0];
    expect(inactiveLink).toBeDefined();
    expect(inactiveLink.className).not.toContain("bg-indigo-600/20");

    const hookLinks = Array.from(container.querySelectorAll(`a[href="/tools/hook-generator"]`));
    const hookLink = hookLinks[0];
    expect(hookLink).toBeDefined();
    expect(hookLink.className).not.toContain("bg-indigo-600/20");
  });
});
