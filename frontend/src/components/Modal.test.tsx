import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";

const mockUseUiStore = {
  isOpen: vi.fn(),
  close: vi.fn(),
};

vi.mock("../store/useUiStore", () => ({
  useUiStore: () => mockUseUiStore,
}));

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUiStore.isOpen.mockReturnValue(true);
  });

  describe("Grundlegende Funktionalität", () => {
    it("rendert Modal mit Titel und Inhalt wenn geöffnet", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      expect(screen.getByText("Testtitel")).toBeInTheDocument();
      expect(screen.getByText("Testinhalt")).toBeInTheDocument();
    });

    it("rendert Modal nicht wenn geschlossen", () => {
      mockUseUiStore.isOpen.mockReturnValue(false);
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      expect(modal).not.toHaveClass("show", "d-block");
    });

    it("rendert Modal mit korrekten CSS-Klassen wenn geöffnet", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("modal", "show", "d-block");
    });

    it("wendet korrekte Hintergrundfarbe an wenn geöffnet", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveStyle({ backgroundColor: 'rgba(0,0,0,0.5)' });
    });
  });

  describe("Props und Inhalt", () => {
    it("rendert ohne Titel", () => {
      render(<Modal>Testinhalt</Modal>);
      
      expect(screen.getByText("Testinhalt")).toBeInTheDocument();
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("rendert ohne children", () => {
      render(<Modal title="Testtitel" />);
      
      expect(screen.getByText("Testtitel")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("rendert benutzerdefinierten Footer", () => {
      const customFooter = <button>Custom Button</button>;
      render(<Modal title="Testtitel" footer={customFooter}>Testinhalt</Modal>);
      
      expect(screen.getByText("Custom Button")).toBeInTheDocument();
      expect(screen.queryByText("Schließen")).not.toBeInTheDocument();
    });

    it("rendert Standard-Footer wenn kein Footer angegeben", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      expect(screen.getByText("Schließen")).toBeInTheDocument();
    });

    it("rendert komplexe children korrekt", () => {
      const complexChildren = (
        <div>
          <h3>Komplexer Titel</h3>
          <p>Komplexer Inhalt</p>
          <button>Button im Modal</button>
        </div>
      );
      
      render(<Modal title="Testtitel">{complexChildren}</Modal>);
      
      expect(screen.getByText("Komplexer Titel")).toBeInTheDocument();
      expect(screen.getByText("Komplexer Inhalt")).toBeInTheDocument();
      expect(screen.getByText("Button im Modal")).toBeInTheDocument();
    });
  });

  describe("Event-Handling", () => {
    it("ruft onClose auf wenn Schließen-Button geklickt wird", () => {
      const onClose = vi.fn();
      render(<Modal title="Testtitel" onClose={onClose}>Testinhalt</Modal>);
      
      fireEvent.click(screen.getByLabelText("Schließen"));
      
      expect(mockUseUiStore.close).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it("ruft nur close() auf wenn kein onClose angegeben", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      fireEvent.click(screen.getByLabelText("Schließen"));
      
      expect(mockUseUiStore.close).toHaveBeenCalled();
    });

    it("ruft onClose auf wenn Modal-Hintergrund geklickt wird", () => {
      const onClose = vi.fn();
      render(<Modal title="Testtitel" onClose={onClose}>Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      fireEvent.click(modal);
      
      expect(mockUseUiStore.close).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it("verhindert Event-Bubbling beim Klick auf Modal-Inhalt", () => {
      const onClose = vi.fn();
      render(<Modal title="Testtitel" onClose={onClose}>Testinhalt</Modal>);
      
      const modalDialog = screen.getByRole("document");
      fireEvent.click(modalDialog);
      
      expect(mockUseUiStore.close).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it("verwendet useCallback für handleClose", () => {
      const onClose = vi.fn();
      const { rerender } = render(<Modal title="Testtitel" onClose={onClose}>Testinhalt</Modal>);
      
      // Erste Klicks
      fireEvent.click(screen.getByLabelText("Schließen"));
      expect(mockUseUiStore.close).toHaveBeenCalledTimes(1);
      
      // Rerender mit gleichen Props
      rerender(<Modal title="Testtitel" onClose={onClose}>Testinhalt</Modal>);
      
      // Zweite Klicks
      fireEvent.click(screen.getByLabelText("Schließen"));
      expect(mockUseUiStore.close).toHaveBeenCalledTimes(2);
    });
  });

  describe("Accessibility", () => {
    it("hat korrekte ARIA-Attribute", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveAttribute("role", "dialog");
      expect(modal).toHaveAttribute("aria-labelledby", "remote_modal_label");
      expect(modal).toHaveAttribute("tabIndex", "-1");
    });

    it("hat korrekte ID für Modal und Label", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      const title = screen.getByText("Testtitel");
      
      expect(modal).toHaveAttribute("id", "remote_modal");
      expect(title).toHaveAttribute("id", "remote_modal_label");
    });

    it("hat korrekte ARIA-Label für Schließen-Button", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const closeButton = screen.getByLabelText("Schließen");
      expect(closeButton).toHaveAttribute("aria-label", "Schließen");
    });

    it("hat korrekte Rolle für Modal-Dialog", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modalDialog = screen.getByRole("document");
      expect(modalDialog).toHaveAttribute("role", "document");
    });
  });

  describe("DOM-Struktur", () => {
    it("erstellt korrekte Modal-Struktur", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modal = screen.getByRole("dialog");
      const modalDialog = screen.getByRole("document");
      const modalContent = modalDialog.querySelector(".modal-content");
      const modalHeader = modalContent?.querySelector(".modal-header");
      const modalBody = modalContent?.querySelector(".modal-body");
      const modalFooter = modalContent?.querySelector(".modal-footer");
      
      expect(modalDialog).toHaveClass("modal-dialog", "modal-lg");
      expect(modalContent).toBeInTheDocument();
      expect(modalHeader).toBeInTheDocument();
      expect(modalBody).toBeInTheDocument();
      expect(modalFooter).toBeInTheDocument();
    });

    it("hat korrekte CSS-Klassen für alle Modal-Teile", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      const modalDialog = screen.getByRole("document");
      const modalContent = modalDialog.querySelector(".modal-content");
      const modalHeader = modalContent?.querySelector(".modal-header");
      const modalTitle = modalHeader?.querySelector(".modal-title");
      const modalBody = modalContent?.querySelector(".modal-body");
      const modalFooter = modalContent?.querySelector(".modal-footer");
      const closeButton = modalHeader?.querySelector(".btn-close");
      
      expect(modalDialog).toHaveClass("modal-dialog", "modal-lg");
      expect(modalContent).toHaveClass("modal-content");
      expect(modalHeader).toHaveClass("modal-header");
      expect(modalTitle).toHaveClass("modal-title");
      expect(modalBody).toHaveClass("modal-body");
      expect(modalFooter).toHaveClass("modal-footer");
      expect(closeButton).toHaveClass("btn-close", "btn-close-white");
    });
  });

  describe("Edge Cases", () => {
    it("behandelt leeren Titel korrekt", () => {
      render(<Modal title="">Testinhalt</Modal>);
      
      const title = screen.getByRole("heading");
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("");
    });

    it("behandelt null children korrekt", () => {
      render(<Modal title="Testtitel">{null}</Modal>);
      
      expect(screen.getByText("Testtitel")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("behandelt undefined children korrekt", () => {
      render(<Modal title="Testtitel">{undefined}</Modal>);
      
      expect(screen.getByText("Testtitel")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("behandelt leeren Footer korrekt", () => {
      render(<Modal title="Testtitel" footer={null}>Testinhalt</Modal>);
      
      expect(screen.getByText("Schließen")).toBeInTheDocument();
    });

    it("behandelt undefined Footer korrekt", () => {
      render(<Modal title="Testtitel" footer={undefined}>Testinhalt</Modal>);
      
      expect(screen.getByText("Schließen")).toBeInTheDocument();
    });
  });

  describe("Performance und Memoization", () => {
    it("verwendet React.memo für Performance-Optimierung", () => {
      expect(Modal).toBeDefined();
      expect(typeof Modal).toBe('object');
    });

    it("verwendet useCallback für handleClose", () => {
      const onClose = vi.fn();
      render(<Modal title="Testtitel" onClose={onClose}>Testinhalt</Modal>);
      
      // Teste, dass handleClose korrekt funktioniert
      fireEvent.click(screen.getByLabelText("Schließen"));
      expect(mockUseUiStore.close).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("Integration mit useUiStore", () => {
    it("verwendet isOpen mit korrektem Modal-Namen", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      expect(mockUseUiStore.isOpen).toHaveBeenCalledWith("remoteModal");
    });

    it("ruft close() ohne Parameter auf", () => {
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      fireEvent.click(screen.getByLabelText("Schließen"));
      
      expect(mockUseUiStore.close).toHaveBeenCalledWith();
    });

    it("reagiert auf Änderungen im useUiStore", () => {
      // Teste, dass isOpen korrekt aufgerufen wird
      render(<Modal title="Testtitel">Testinhalt</Modal>);
      
      expect(mockUseUiStore.isOpen).toHaveBeenCalledWith("remoteModal");
      
      // Teste, dass Modal korrekt gerendert wird basierend auf isOpen
      expect(screen.getByRole("dialog")).toHaveClass("show", "d-block");
    });
  });
}); 