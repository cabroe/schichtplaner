import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalDemo from "./ModalDemo";

describe("ModalDemo", () => {
  it("zeigt das Modal nach Klick auf den Button", () => {
    render(
      <MemoryRouter>
        <ModalDemo />
      </MemoryRouter>
    );
    const button = screen.getByText("Modal öffnen");
    fireEvent.click(button);
    expect(screen.getByText("Beispiel-Modal")).toBeInTheDocument();
    expect(screen.getByText("Dies ist ein Beispielinhalt im Modal.")).toBeInTheDocument();
  });
}); 