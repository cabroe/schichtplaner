import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => ({
    isOpen: (name: string) => name === "remoteModal",
    close: vi.fn(),
  }),
}));

describe("Modal", () => {
  it("zeigt Titel und Children an, wenn offen", () => {
    render(<Modal title="Testtitel">Testinhalt</Modal>);
    expect(screen.getByText("Testtitel")).toBeInTheDocument();
    expect(screen.getByText("Testinhalt")).toBeInTheDocument();
  });

  it("ruft onClose auf, wenn Schließen-Button geklickt wird", () => {
    const onClose = vi.fn();
    render(<Modal title="Test" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Schließen"));
    expect(onClose).toHaveBeenCalled();
  });
}); 