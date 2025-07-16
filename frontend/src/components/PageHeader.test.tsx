import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it("rendert die Children korrekt", () => {
    render(
      <PageHeader>
        <div data-testid="content">Testinhalt</div>
      </PageHeader>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByText("Testinhalt")).toBeInTheDocument();
  });
}); 