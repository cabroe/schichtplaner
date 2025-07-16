import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SimpleTemplate from "./SimpleTemplate";

describe("SimpleTemplate", () => {
  it("rendert die Children korrekt", () => {
    render(
      <SimpleTemplate>
        <div data-testid="content">Testinhalt</div>
      </SimpleTemplate>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByText("Testinhalt")).toBeInTheDocument();
  });
}); 