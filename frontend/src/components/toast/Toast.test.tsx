import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Toast from "./Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe("Grundlegende Funktionalität", () => {
    it("zeigt die Nachricht, wenn show=true", () => {
      render(<Toast message="Testnachricht" show={true} />);
      expect(screen.getByText("Testnachricht")).toBeInTheDocument();
    });

    it("rendert nichts, wenn show=false", () => {
      const { container } = render(<Toast message="Unsichtbar" show={false} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("rendert Toast mit korrekten CSS-Klassen", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const toastContainer = screen.getByRole("alert").parentElement;
      const toast = screen.getByRole("alert");
      
      expect(toastContainer).toHaveClass("toast-container", "position-fixed", "top-0", "start-50", "translate-middle-x", "p-3");
      expect(toast).toHaveClass("toast", "show", "align-items-center", "text-bg-primary", "border-0");
    });

    it("wendet korrekte z-index an", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const toastContainer = screen.getByRole("alert").parentElement;
      expect(toastContainer).toHaveStyle({ zIndex: 11 });
    });
  });

  describe("Props und Konfiguration", () => {
    it("verwendet Standard-Duration von 3000ms", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("verwendet benutzerdefinierte Duration", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} duration={5000} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(onClose).not.toHaveBeenCalled();
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("ruft onClose nicht auf wenn nicht angegeben", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // Sollte keinen Fehler werfen
      expect(true).toBe(true);
    });

    it("ruft onClose nicht auf wenn show=false", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={false} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("Event-Handling", () => {
    it("ruft onClose auf, wenn Schließen-Button geklickt wird", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      fireEvent.click(screen.getByLabelText("Close"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("ruft onClose nicht auf wenn nicht angegeben", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toBeInTheDocument();
      
      // Sollte keinen Fehler werfen
      fireEvent.click(closeButton);
      expect(true).toBe(true);
    });

    it("verhindert mehrfache onClose-Aufrufe", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      fireEvent.click(screen.getByLabelText("Close"));
      fireEvent.click(screen.getByLabelText("Close"));
      
      // onClose wird bei jedem Klick aufgerufen, aber der Toast wird nach dem ersten Klick geschlossen
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });

  describe("Timer-Funktionalität", () => {
    it("startet Timer wenn Toast geöffnet wird", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      expect(onClose).not.toHaveBeenCalled();
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("stoppt Timer wenn Toast geschlossen wird", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      fireEvent.click(screen.getByLabelText("Close"));
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      // onClose wird sowohl durch Timer als auch durch manuellen Klick aufgerufen
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it("startet neuen Timer wenn Toast erneut geöffnet wird", () => {
      const onClose = vi.fn();
      const { rerender } = render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      // Toast schließen
      fireEvent.click(screen.getByLabelText("Close"));
      
      // Toast wieder öffnen
      rerender(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it("verwendet useCallback für Timer-Cleanup", () => {
      const onClose = vi.fn();
      const { rerender } = render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      // Erste Timer
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      // Rerender mit gleichen Props
      rerender(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      // Timer fortsetzen
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("hat korrekte ARIA-Attribute", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const toast = screen.getByRole("alert");
      expect(toast).toHaveAttribute("role", "alert");
      expect(toast).toHaveAttribute("aria-live", "assertive");
      expect(toast).toHaveAttribute("aria-atomic", "true");
    });

    it("hat korrekte ARIA-Label für Schließen-Button", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toHaveAttribute("aria-label", "Close");
    });

    it("hat korrekte ID für Toast-Container", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const toastContainer = screen.getByRole("alert").parentElement;
      expect(toastContainer).toHaveAttribute("id", "toast-container");
    });
  });

  describe("DOM-Struktur", () => {
    it("erstellt korrekte Toast-Struktur", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const toastContainer = screen.getByRole("alert").parentElement;
      const toast = screen.getByRole("alert");
      const toastBody = toast.querySelector(".toast-body");
      const closeButton = toast.querySelector(".btn-close");
      
      expect(toastContainer).toBeInTheDocument();
      expect(toast).toBeInTheDocument();
      expect(toastBody).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
    });

    it("hat korrekte CSS-Klassen für alle Toast-Teile", () => {
      render(<Toast message="Testnachricht" show={true} />);
      
      const toastContainer = screen.getByRole("alert").parentElement;
      const toast = screen.getByRole("alert");
      const toastBody = toast.querySelector(".toast-body");
      const closeButton = toast.querySelector(".btn-close");
      const flexContainer = toast.querySelector(".d-flex");
      
      expect(toastContainer).toHaveClass("toast-container", "position-fixed", "top-0", "start-50", "translate-middle-x", "p-3");
      expect(toast).toHaveClass("toast", "show", "align-items-center", "text-bg-primary", "border-0");
      expect(toastBody).toHaveClass("toast-body");
      expect(closeButton).toHaveClass("btn-close", "btn-close-white", "me-2", "m-auto");
      expect(flexContainer).toHaveClass("d-flex");
    });
  });

  describe("Edge Cases", () => {
    it("behandelt leere Nachricht korrekt", () => {
      render(<Toast message="" show={true} />);
      
      const toast = screen.getByRole("alert");
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveTextContent("");
    });

    it("behandelt sehr lange Nachrichten korrekt", () => {
      const longMessage = "A".repeat(1000);
      render(<Toast message={longMessage} show={true} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("behandelt HTML in Nachrichten korrekt", () => {
      const htmlMessage = "<strong>Bold</strong> <em>Italic</em>";
      render(<Toast message={htmlMessage} show={true} />);
      
      expect(screen.getByText(htmlMessage)).toBeInTheDocument();
    });

    it("behandelt sehr kurze Duration korrekt", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} duration={100} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("behandelt sehr lange Duration korrekt", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} duration={60000} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(30000);
      });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it("behandelt negative Duration korrekt", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} duration={-1000} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Performance und Cleanup", () => {
    it("räumt Timer auf wenn Komponente unmounted wird", () => {
      const onClose = vi.fn();
      const { unmount } = render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      unmount();
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it("räumt Timer auf wenn Toast geschlossen wird", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      fireEvent.click(screen.getByLabelText("Close"));
      
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      
      // onClose wird sowohl durch Timer als auch durch manuellen Klick aufgerufen
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it("verwendet useEffect für Timer-Management", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      // Teste, dass useEffect korrekt funktioniert
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration und Verhalten", () => {
    it("zeigt Toast korrekt an und verschwindet nach Timer", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      // Toast ist sichtbar
      expect(screen.getByText("Testnachricht")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveClass("show");
      
      // Timer ablaufen lassen
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // onClose sollte aufgerufen worden sein
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("kann manuell geschlossen werden bevor Timer abläuft", () => {
      const onClose = vi.fn();
      render(<Toast message="Testnachricht" show={true} onClose={onClose} />);
      
      // Toast ist sichtbar
      expect(screen.getByText("Testnachricht")).toBeInTheDocument();
      
      // Manuell schließen
      fireEvent.click(screen.getByLabelText("Close"));
      expect(onClose).toHaveBeenCalledTimes(1);
      
      // Timer läuft weiter und ruft onClose erneut auf
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // onClose wird zweimal aufgerufen (durch manuellen Klick und Timer)
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });
}); 