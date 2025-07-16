import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Times from "./Times";

describe("Times", () => {
  it("rendert ohne Fehler", () => {
    render(
      <MemoryRouter>
        <Times />
      </MemoryRouter>
    );
  });
}); 