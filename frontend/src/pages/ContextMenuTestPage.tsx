import React, { useState } from 'react';
import { ContextMenu, ContextMenuItem, ContextMenuDivider, ContextSubmenu } from '../components';

const ContextMenuTestPage: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0,
    y: 0,
    isOpen: false
  });
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const handleContextMenu = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true
    });
    setSelectedItem(target);
    setActiveSubmenu(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
    setActiveSubmenu(null);
  };

  const logAction = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog(prev => [`${timestamp}: ${action}`, ...prev.slice(0, 9)]);
    handleCloseContextMenu();
  };

  const clearLog = () => {
    setActionLog([]);
  };

  return (
    <div className="row row-deck row-cards">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Kontextmenü Test-Seite</h3>
          </div>
          <div className="card-body">
            <div className="row g-3">
              
              {/* Test-Bereiche */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Test-Bereiche</h4>
                    <p className="text-muted">Rechtsklick auf die Bereiche für Kontextmenü</p>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <div 
                          className="card bg-primary text-white cursor-pointer"
                          style={{ minHeight: '120px', cursor: 'context-menu' }}
                          onContextMenu={(e) => handleContextMenu(e, 'Blauer Bereich')}
                        >
                          <div className="card-body d-flex align-items-center justify-content-center">
                            <div className="text-center">
                              <i className="ti ti-mouse-2 fs-1"></i>
                              <h5 className="mt-2">Blauer Bereich</h5>
                              <small>Rechtsklick hier</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div 
                          className="card bg-success text-white cursor-pointer"
                          style={{ minHeight: '120px', cursor: 'context-menu' }}
                          onContextMenu={(e) => handleContextMenu(e, 'Grüner Bereich')}
                        >
                          <div className="card-body d-flex align-items-center justify-content-center">
                            <div className="text-center">
                              <i className="ti ti-mouse-2 fs-1"></i>
                              <h5 className="mt-2">Grüner Bereich</h5>
                              <small>Rechtsklick hier</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div 
                          className="card bg-warning text-white cursor-pointer"
                          style={{ minHeight: '120px', cursor: 'context-menu' }}
                          onContextMenu={(e) => handleContextMenu(e, 'Gelber Bereich')}
                        >
                          <div className="card-body d-flex align-items-center justify-content-center">
                            <div className="text-center">
                              <i className="ti ti-mouse-2 fs-1"></i>
                              <h5 className="mt-2">Gelber Bereich</h5>
                              <small>Rechtsklick hier</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div 
                          className="card bg-danger text-white cursor-pointer"
                          style={{ minHeight: '120px', cursor: 'context-menu' }}
                          onContextMenu={(e) => handleContextMenu(e, 'Roter Bereich')}
                        >
                          <div className="card-body d-flex align-items-center justify-content-center">
                            <div className="text-center">
                              <i className="ti ti-mouse-2 fs-1"></i>
                              <h5 className="mt-2">Roter Bereich</h5>
                              <small>Rechtsklick hier</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aktionslog */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title">Aktionslog</h4>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearLog}
                    >
                      <i className="ti ti-trash me-1"></i>
                      Löschen
                    </button>
                  </div>
                  <div className="card-body">
                    {selectedItem && (
                      <div className="alert alert-info">
                        <strong>Ausgewähltes Element:</strong> {selectedItem}
                      </div>
                    )}
                    
                    <div className="list-group list-group-flush">
                      {actionLog.length === 0 ? (
                        <div className="text-muted text-center py-3">
                          Noch keine Aktionen ausgeführt
                        </div>
                      ) : (
                        actionLog.map((log, index) => (
                          <div key={index} className="list-group-item">
                            <small className="text-muted">{log}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Anweisungen */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Anweisungen</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h5>Kontextmenü-Features:</h5>
                        <ul className="list-unstyled">
                          <li>✓ Rechtsklick auf farbige Bereiche</li>
                          <li>✓ Verschiedene Menüeinträge mit Icons</li>
                          <li>✓ Trennstriche zwischen Gruppen</li>
                          <li>✓ Untermenüs mit Hover-Effekt</li>
                          <li>✓ Deaktivierte Einträge</li>
                          <li>✓ Gefährliche Aktionen (rot)</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h5>Bedienung:</h5>
                        <ul className="list-unstyled">
                          <li>• <strong>Rechtsklick:</strong> Öffnet Kontextmenü</li>
                          <li>• <strong>Linksklick außerhalb:</strong> Schließt Menü</li>
                          <li>• <strong>Hover über Untermenü:</strong> Öffnet nach 100ms</li>
                          <li>• <strong>Verlassen von Untermenü:</strong> Schließt nach 300ms</li>
                          <li>• <strong>Klick auf Eintrag:</strong> Führt Aktion aus</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Kontextmenü */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={handleCloseContextMenu}
      >
        <ContextMenuItem 
          onClick={() => logAction(`Bearbeiten von "${selectedItem}"`)}
          icon="ti ti-edit"
        >
          Bearbeiten
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => logAction(`Kopieren von "${selectedItem}"`)}
          icon="ti ti-copy"
        >
          Kopieren
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => logAction(`Ausschneiden von "${selectedItem}"`)}
          icon="ti ti-cut"
        >
          Ausschneiden
        </ContextMenuItem>
        
        <ContextMenuDivider />
        
        <ContextSubmenu
          title="Exportieren"
          id="export-submenu"
          icon="ti ti-download"
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        >
          <ContextMenuItem 
            onClick={() => logAction(`PDF-Export von "${selectedItem}"`)}
            icon="ti ti-file-type-pdf"
          >
            Als PDF
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`Excel-Export von "${selectedItem}"`)}
            icon="ti ti-file-type-xlsx"
          >
            Als Excel
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`CSV-Export von "${selectedItem}"`)}
            icon="ti ti-file-type-csv"
          >
            Als CSV
          </ContextMenuItem>
        </ContextSubmenu>
        
        <ContextSubmenu
          title="Teilen"
          id="share-submenu"
          icon="ti ti-share"
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        >
          <ContextMenuItem 
            onClick={() => logAction(`E-Mail teilen von "${selectedItem}"`)}
            icon="ti ti-mail"
          >
            Per E-Mail
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`Link teilen von "${selectedItem}"`)}
            icon="ti ti-link"
          >
            Link kopieren
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => logAction(`Social Media teilen von "${selectedItem}"`)}
            icon="ti ti-share-2"
          >
            Social Media
          </ContextMenuItem>
        </ContextSubmenu>
        
        <ContextMenuDivider />
        
        <ContextMenuItem 
          onClick={() => logAction(`Eigenschaften von "${selectedItem}"`)}
          icon="ti ti-settings"
        >
          Eigenschaften
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => logAction(`Hilfe für "${selectedItem}"`)}
          icon="ti ti-help"
          disabled
        >
          Hilfe (deaktiviert)
        </ContextMenuItem>
        
        <ContextMenuDivider />
        
        <ContextMenuItem 
          onClick={() => logAction(`Löschen von "${selectedItem}"`)}
          icon="ti ti-trash"
          danger
        >
          Löschen
        </ContextMenuItem>
      </ContextMenu>
    </div>
  );
};

export default ContextMenuTestPage;
