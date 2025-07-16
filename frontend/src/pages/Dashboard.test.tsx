import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  it("rendert ohne Fehler", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  });
}); 