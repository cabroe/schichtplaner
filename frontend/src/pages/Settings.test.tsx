import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Settings from "./Settings";

describe("Settings", () => {
  it("rendert ohne Fehler", () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );
  });
}); 