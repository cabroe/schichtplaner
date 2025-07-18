import React from "react";

const Times: React.FC = () => {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Zeiten - Test Content</h3>
        </div>
        <div className="card-body">
          <h4>Test-Content mit Mindesthöhe über Bildschirm hinaus</h4>
          
          {/* Erste Sektion */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Sektion 1</h4>
                </div>
                <div className="card-body">
                  <p>Dies ist Test-Content für die erste Sektion. Hier wird viel Text hinzugefügt, um die Höhe zu erhöhen.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Sektion 2</h4>
                </div>
                <div className="card-body">
                  <p>Zweite Sektion mit zusätzlichem Content für Höhentest.</p>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zweite Sektion */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Lange Tabelle für Höhentest</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Datum</th>
                          <th>Startzeit</th>
                          <th>Endzeit</th>
                          <th>Dauer</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 50 }, (_, i) => (
                          <tr key={i + 1}>
                            <td>{i + 1}</td>
                            <td>Mitarbeiter {i + 1}</td>
                            <td>2024-01-{(i % 30) + 1}</td>
                            <td>08:00</td>
                            <td>17:00</td>
                            <td>9h</td>
                            <td>
                              <span className={`badge bg-${i % 3 === 0 ? 'success' : i % 3 === 1 ? 'warning' : 'danger'}`}>
                                {i % 3 === 0 ? 'Abgeschlossen' : i % 3 === 1 ? 'Laufend' : 'Überfällig'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dritte Sektion */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Statistiken</h4>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col">
                      <div className="text-muted">Gesamtstunden</div>
                      <div className="h3 mb-0">1,247</div>
                    </div>
                    <div className="col">
                      <div className="text-muted">Überstunden</div>
                      <div className="h3 mb-0">23</div>
                    </div>
                    <div className="col">
                      <div className="text-muted">Fehltage</div>
                      <div className="h3 mb-0">5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Aktuelle Schichten</h4>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <span className="avatar avatar-sm bg-primary">
                              {String.fromCharCode(65 + (i % 26))}
                            </span>
                          </div>
                          <div className="col">
                            <div className="text-truncate">
                              Schicht {i + 1} - {['Frühschicht', 'Spätschicht', 'Nachtschicht'][i % 3]}
                            </div>
                            <div className="text-muted">
                              {new Date(2024, 0, (i % 30) + 1).toLocaleDateString('de-DE')} | 08:00 - 16:00
                            </div>
                          </div>
                          <div className="col-auto">
                            <span className={`badge bg-${i % 2 === 0 ? 'success' : 'warning'}`}>
                              {i % 2 === 0 ? 'Aktiv' : 'Geplant'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vierte Sektion - Zusätzlicher Content */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Zusätzlicher Test-Content</h4>
                </div>
                <div className="card-body">
                  <p>Diese Sektion enthält zusätzlichen Content, um sicherzustellen, dass die Seite über den Bildschirm hinausgeht.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                  <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
                  <p>Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
                  <p>Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>
                  <p>Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fünfte Sektion - Weitere Höhe */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Weitere Test-Daten</h4>
                </div>
                <div className="card-body">
                  <p>Hier sind weitere Test-Daten, um die Höhe zu erhöhen und das Layout-Problem zu testen.</p>
                  <ul>
                    <li>Test-Eintrag 1</li>
                    <li>Test-Eintrag 2</li>
                    <li>Test-Eintrag 3</li>
                    <li>Test-Eintrag 4</li>
                    <li>Test-Eintrag 5</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Letzte Sektion</h4>
                </div>
                <div className="card-body">
                  <p>Dies ist die letzte Sektion mit Test-Content. Die Seite sollte jetzt deutlich über den Bildschirm hinausgehen.</p>
                  <p>Mit diesem Content können wir das Layout-Problem zwischen Sidebar und Header testen.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted">
              <strong>Test abgeschlossen:</strong> Diese Seite hat jetzt eine Mindesthöhe, die über den Bildschirm hinausgeht.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Times; 