import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu, ContextMenuItem, ContextMenuDivider } from "./ContextMenu";

describe("ContextMenu", () => {
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

  it("ruft onClick auf wenn auf ein Menü-Item geklickt wird", () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <ContextMenu x={100} y={200} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={onClick}>Test Item</ContextMenuItem>
      </ContextMenu>
    );

    fireEvent.click(screen.getByText("Test Item"));
    expect(onClick).toHaveBeenCalled();
  });

  it("ruft onClick nicht auf wenn Item disabled ist", () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <ContextMenu x={100} y={200} isOpen={true} onClose={onClose}>
        <ContextMenuItem onClick={onClick} disabled={true}>Disabled Item</ContextMenuItem>
      </ContextMenu>
    );

    fireEvent.click(screen.getByText("Disabled Item"));
    expect(onClick).not.toHaveBeenCalled();
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
});

describe("ContextMenuDivider", () => {
  it("rendert einen Trennstrich", () => {
    render(<ContextMenuDivider />);
    
    const divider = document.querySelector("hr.dropdown-divider");
    expect(divider).toBeInTheDocument();
  });
}); 