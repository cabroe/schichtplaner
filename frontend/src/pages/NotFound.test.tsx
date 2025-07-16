import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("zeigt die 404-Seite an", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText(/We could not find the page/)).toBeInTheDocument();
    expect(screen.getByText("Take me home")).toBeInTheDocument();
  });
}); 