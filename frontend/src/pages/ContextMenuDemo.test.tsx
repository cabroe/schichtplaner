import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContextMenuDemo from "./ContextMenuDemo";

// Mock für console.log
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe("ContextMenuDemo", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it("rendert die Demo-Seite korrekt", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    expect(screen.getByText("ContextMenu Demo")).toBeInTheDocument();
    expect(screen.getByText("Klicken Sie mit der rechten Maustaste auf den Bereich unten, um das Kontextmenü zu öffnen:")).toBeInTheDocument();
    expect(screen.getByText("Rechtsklick hier für Kontextmenü")).toBeInTheDocument();
  });

  it("öffnet das Kontextmenü bei Rechtsklick", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    expect(contextArea).toBeInTheDocument();

    // Rechtsklick simulieren
    fireEvent.contextMenu(contextArea!);

    // Prüfen ob Menü-Einträge sichtbar sind
    expect(screen.getByText("Bearbeiten")).toBeInTheDocument();
    expect(screen.getByText("Kopieren")).toBeInTheDocument();
    expect(screen.getByText("Ausschneiden")).toBeInTheDocument();
    expect(screen.getByText("Löschen")).toBeInTheDocument();
    expect(screen.getByText("Eigenschaften (deaktiviert)")).toBeInTheDocument();
  });

  it("führt Aktionen aus wenn auf Menü-Einträge geklickt wird", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    fireEvent.contextMenu(contextArea!);

    // Auf "Bearbeiten" klicken
    fireEvent.click(screen.getByText("Bearbeiten"));
    expect(consoleSpy).toHaveBeenCalledWith("Aktion ausgeführt: Bearbeiten");

    // Menü sollte geschlossen sein
    expect(screen.queryByText("Bearbeiten")).not.toBeInTheDocument();
  });

  it("führt mehrere Aktionen korrekt aus", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    
    // Erste Aktion
    fireEvent.contextMenu(contextArea!);
    fireEvent.click(screen.getByText("Kopieren"));
    expect(consoleSpy).toHaveBeenCalledWith("Aktion ausgeführt: Kopieren");

    // Zweite Aktion
    fireEvent.contextMenu(contextArea!);
    fireEvent.click(screen.getByText("Löschen"));
    expect(consoleSpy).toHaveBeenCalledWith("Aktion ausgeführt: Löschen");
  });

  it("verhindert Standard-Kontextmenü-Verhalten", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    
    // preventDefault sollte aufgerufen werden
    const preventDefaultSpy = vi.fn();
    fireEvent.contextMenu(contextArea!, { preventDefault: preventDefaultSpy });
    
    // Das Menü sollte trotzdem geöffnet werden
    expect(screen.getByText("Bearbeiten")).toBeInTheDocument();
  });

  it("zeigt Icons in den Menü-Einträgen an", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    fireEvent.contextMenu(contextArea!);

    // Prüfen ob Icons vorhanden sind
    const editIcon = document.querySelector('.fas.fa-edit');
    const copyIcon = document.querySelector('.fas.fa-copy');
    const cutIcon = document.querySelector('.fas.fa-cut');
    const trashIcon = document.querySelector('.fas.fa-trash');
    const infoIcon = document.querySelector('.fas.fa-info-circle');

    expect(editIcon).toBeInTheDocument();
    expect(copyIcon).toBeInTheDocument();
    expect(cutIcon).toBeInTheDocument();
    expect(trashIcon).toBeInTheDocument();
    expect(infoIcon).toBeInTheDocument();
  });

  it("deaktiviert Menü-Einträge korrekt", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    fireEvent.contextMenu(contextArea!);

    const disabledItem = screen.getByText("Eigenschaften (deaktiviert)");
    expect(disabledItem).toHaveClass("disabled");
  });

  it("schließt das Menü beim Klick außerhalb", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    fireEvent.contextMenu(contextArea!);

    // Menü ist geöffnet
    expect(screen.getByText("Bearbeiten")).toBeInTheDocument();

    // Klick außerhalb
    fireEvent.mouseDown(document.body);

    // Menü sollte geschlossen sein
    expect(screen.queryByText("Bearbeiten")).not.toBeInTheDocument();
  });

  it("positioniert das Menü an der richtigen Stelle", () => {
    render(
      <MemoryRouter>
        <ContextMenuDemo />
      </MemoryRouter>
    );

    const contextArea = screen.getByText("Rechtsklick hier für Kontextmenü").parentElement;
    
    // Rechtsklick an einer spezifischen Position
    fireEvent.contextMenu(contextArea!, { 
      clientX: 150, 
      clientY: 200 
    });

    const menu = document.querySelector('.dropdown-menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveStyle({ 
      position: 'fixed',
      top: '200px',
      left: '150px'
    });
  });
}); 