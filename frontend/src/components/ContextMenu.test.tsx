import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu, ContextMenuItem, ContextMenuDivider } from "./ContextMenu";

describe("ContextMenu", () => {
  beforeEach(() => {
    // DOM-Elemente für Tests vorbereiten
    document.body.innerHTML = '';
  });

  it("rendert das Menü wenn isOpen true ist", () => {
    const onClose = vi.fn();
    render(
      <ContextMenu x={100} y={200} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={() => {}}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("rendert nichts wenn isOpen false ist", () => {
    const onClose = vi.fn();
    const { container } = render(
      <ContextMenu x={100} y={200} isOpen={false} onClose={onClose}>
        <ContextMenuItem onClick={() => {}}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    expect(container.firstChild).toBeNull();
  });

  it("ruft onClose auf wenn außerhalb geklickt wird", () => {
    const onClose = vi.fn();
    render(
      <ContextMenu x={100} y={200} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={() => {}}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it("ruft onClose nicht auf wenn innerhalb des Menüs geklickt wird", () => {
    const onClose = vi.fn();
    render(
      <ContextMenu x={100} y={200} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={() => {}}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    const menu = document.querySelector('.dropdown-menu');
    fireEvent.mouseDown(menu!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("positioniert das Menü an den angegebenen Koordinaten", () => {
    const onClose = vi.fn();
    render(
      <ContextMenu x={150} y={250} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={() => {}}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    const menu = document.querySelector('.dropdown-menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveStyle({
      position: 'fixed',
      top: '250px',
      left: '150px'
    });
  });

  it("hat korrekte CSS-Klassen", () => {
    const onClose = vi.fn();
    render(
      <ContextMenu x={100} y={200} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={() => {}}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    const menu = document.querySelector('.dropdown-menu');
    expect(menu).toHaveClass('dropdown-menu', 'show');
  });
});

describe("ContextMenuItem", () => {
  it("rendert den Inhalt korrekt", () => {
    const onClick = vi.fn();
    render(<ContextMenuItem onClick={onClick}>Test Item</ContextMenuItem>);
    
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("hat disabled Klasse wenn disabled prop true ist", () => {
    const onClick = vi.fn();
    render(<ContextMenuItem onClick={onClick} disabled={true}>Disabled Item</ContextMenuItem>);
    
    const item = screen.getByText("Disabled Item");
    expect(item).toHaveClass("disabled");
  });

  it("ruft onClick bei Klick auf", () => {
    const onClick = vi.fn();
    render(<ContextMenuItem onClick={onClick}>Test Item</ContextMenuItem>);
    
    const item = screen.getByText("Test Item");
    fireEvent.click(item);
    
    expect(onClick).toHaveBeenCalled();
  });

  it("ruft onClick nicht auf wenn disabled", () => {
    const onClick = vi.fn();
    render(<ContextMenuItem onClick={onClick} disabled={true}>Disabled Item</ContextMenuItem>);
    
    const item = screen.getByText("Disabled Item");
    fireEvent.click(item);
    
    expect(onClick).not.toHaveBeenCalled();
  });

  it("hat korrekte CSS-Klassen", () => {
    const onClick = vi.fn();
    render(<ContextMenuItem onClick={onClick}>Test Item</ContextMenuItem>);
    
    const item = screen.getByText("Test Item");
    expect(item).toHaveClass("dropdown-item");
  });

  it("rendert komplexe Inhalte korrekt", () => {
    const onClick = vi.fn();
    render(
      <ContextMenuItem onClick={onClick}>
        <i className="fas fa-edit"></i>
        <span>Bearbeiten</span>
      </ContextMenuItem>
    );
    
    expect(screen.getByText("Bearbeiten")).toBeInTheDocument();
    expect(document.querySelector('.fas.fa-edit')).toBeInTheDocument();
  });
});

describe("ContextMenuDivider", () => {
  it("rendert einen Trennstrich", () => {
    render(<ContextMenuDivider />);
    
    const divider = document.querySelector("hr.dropdown-divider");
    expect(divider).toBeInTheDocument();
  });

  it("hat korrekte CSS-Klassen", () => {
    render(<ContextMenuDivider />);
    
    const divider = document.querySelector("hr");
    expect(divider).toHaveClass("dropdown-divider");
  });
}); 