import React, { useState } from "react";
import { ContextMenu, ContextMenuItem, ContextMenuDivider, ContextSubmenu } from "../components/ContextMenu";

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

  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>("Beispiel-Element");

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      x: 0,
      y: 0,
    });
    setActiveSubmenu(null);
  };

  const logAction = (action: string) => {
    console.log(`Aktion ausgeführt: ${action}`);
    handleCloseContextMenu();
  };

  return (
    <div>
      <h1>ContextMenu Demo - Erweiterte Version</h1>
      <p>Klicken Sie mit der rechten Maustaste auf den Bereich unten, um das erweiterte Kontextmenü zu öffnen:</p>
      
      <div
        style={{
          width: "400px",
          height: "300px",
          border: "1px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "",
          cursor: "context-menu",
          borderRadius: "8px",
        }}
        onContextMenu={handleContextMenu}
      >
        <div style={{ textAlign: "center" }}>
          <p><strong>Rechtsklick hier für Kontextmenü</strong></p>
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            Ausgewähltes Element: "{selectedItem}"
          </p>
        </div>
      </div>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={handleCloseContextMenu}
      >
        <ContextMenuItem 
          onClick={() => logAction(`Bearbeiten von "${selectedItem}"`)}
          icon="fas fa-edit"
        >
          Bearbeiten
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => logAction(`Kopieren von "${selectedItem}"`)}
          icon="fas fa-copy"
        >
          Kopieren
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => logAction(`Ausschneiden von "${selectedItem}"`)}
          icon="fas fa-cut"
        >
          Ausschneiden
        </ContextMenuItem>
        
        <ContextMenuDivider />
        
        <ContextSubmenu
          title="Exportieren"
          id="export-submenu"
          icon="fas fa-download"
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        >
          <ContextMenuItem 
            onClick={() => logAction(`PDF-Export von "${selectedItem}"`)}
            icon="fas fa-file-pdf"
          >
            Als PDF
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`Excel-Export von "${selectedItem}"`)}
            icon="fas fa-file-excel"
          >
            Als Excel
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`CSV-Export von "${selectedItem}"`)}
            icon="fas fa-file-csv"
          >
            Als CSV
          </ContextMenuItem>
        </ContextSubmenu>
        
        <ContextSubmenu
          title="Teilen"
          id="share-submenu"
          icon="fas fa-share"
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        >
          <ContextMenuItem 
            onClick={() => logAction(`E-Mail teilen von "${selectedItem}"`)}
            icon="fas fa-envelope"
          >
            Per E-Mail
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`Link teilen von "${selectedItem}"`)}
            icon="fas fa-link"
          >
            Link kopieren
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`Social Media teilen von "${selectedItem}"`)}
            icon="fas fa-share-alt"
          >
            Social Media
          </ContextMenuItem>
        </ContextSubmenu>
        
        <ContextMenuDivider />
        
        <ContextMenuItem 
          onClick={() => logAction(`Eigenschaften von "${selectedItem}"`)}
          icon="fas fa-cog"
        >
          Eigenschaften
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => logAction(`Hilfe für "${selectedItem}"`)}
          icon="fas fa-question-circle"
          disabled
        >
          Hilfe (deaktiviert)
        </ContextMenuItem>
        
        <ContextMenuDivider />
        
        <ContextMenuItem 
          onClick={() => logAction(`Löschen von "${selectedItem}"`)}
          icon="fas fa-trash"
          danger
        >
          Löschen
        </ContextMenuItem>
      </ContextMenu>
    </div>
  );
};

export default ContextMenuDemo; 