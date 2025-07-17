import React, { useState } from "react";
import { ContextMenu, ContextMenuItem, ContextMenuDivider } from "../components/ContextMenu";

const ContextMenuDemo: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleClose = () => {
    setContextMenu({
      isOpen: false,
      x: 0,
      y: 0,
    });
  };

  const handleAction = (action: string) => {
    console.log(`Aktion ausgeführt: ${action}`);
    handleClose();
  };

  return (
    <div>
      <h1>ContextMenu Demo</h1>
      <p>Klicken Sie mit der rechten Maustaste auf den Bereich unten, um das Kontextmenü zu öffnen:</p>
      
      <div
        style={{
          width: "400px",
          height: "300px",
          border: "2px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "",
          cursor: "context-menu",
        }}
        onContextMenu={handleContextMenu}
      >
        <p>Rechtsklick hier für Kontextmenü</p>
      </div>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={handleClose}
      >
        <ContextMenuItem onClick={() => handleAction("Bearbeiten")}>
          <i className="fas fa-edit me-2"></i>
          Bearbeiten
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction("Kopieren")}>
          <i className="fas fa-copy me-2"></i>
          Kopieren
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction("Ausschneiden")}>
          <i className="fas fa-cut me-2"></i>
          Ausschneiden
        </ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem onClick={() => handleAction("Löschen")}>
          <i className="fas fa-trash me-2"></i>
          Löschen
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction("Eigenschaften")} disabled={true}>
          <i className="fas fa-info-circle me-2"></i>
          Eigenschaften (deaktiviert)
        </ContextMenuItem>
      </ContextMenu>
    </div>
  );
};

export default ContextMenuDemo; 