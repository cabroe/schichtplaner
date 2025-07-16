import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ToastDemo from "./ToastDemo";

describe("ToastDemo", () => {
  it("zeigt den Toast nach Klick auf den Button", () => {
    render(
      <MemoryRouter>
        <ToastDemo />
      </MemoryRouter>
    );
    const button = screen.getByText("Toast anzeigen");
    fireEvent.click(button);
    expect(screen.getByText("Dies ist eine Beispiel-Toast-Nachricht!")).toBeInTheDocument();
  });
}); 