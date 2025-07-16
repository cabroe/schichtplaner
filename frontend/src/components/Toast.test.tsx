import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast", () => {
  it("zeigt die Nachricht, wenn show=true", () => {
    render(<Toast message="Testnachricht" show={true} />);
    expect(screen.getByText("Testnachricht")).toBeInTheDocument();
  });

  it("ruft onClose auf, wenn Button geklickt wird", () => {
    const onClose = vi.fn();
    render(<Toast message="Test" show={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("rendert nichts, wenn show=false", () => {
    const { container } = render(<Toast message="Unsichtbar" show={false} />);
    expect(container).toBeEmptyDOMElement();
  });
}); 