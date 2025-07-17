import React from "react";

const About: React.FC = () => {
  return (
    <div className="row row-cards">
      <div className="d-print-none hidden-no-space"></div>

      <section className="content">
        <div className="row row-cards mb-3">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body card_intro p-4 text-center">
                <img 
                  src="/vite.svg" 
                  className="avatar avatar-2xl mb-3 avatar-rounded" 
                  alt="Schichtplaner"
                />

                <h3 className="m-0 mb-1">
                  <a href="https://github.com/cabroe/schichtplaner" target="_blank" rel="noopener noreferrer">
                    Schichtplaner
                  </a>
                </h3>
                <div className="text-body-secondary">
                  1.0.0
                </div>
              </div>
              <div className="d-flex">
                <a href="https://github.com/cabroe/schichtplaner" target="_blank" rel="noopener noreferrer" className="card-btn">
                  <i className="me-2 text-body-secondary fab fa-github"></i>
                  GitHub
                </a>
                <a href="https://github.com/cabroe/schichtplaner/issues" target="_blank" rel="noopener noreferrer" className="card-btn">
                  <i className="me-2 text-body-secondary far fa-question-circle"></i>
                  Support
                </a>
              </div>
              <div className="d-flex">
                <a href="https://www.kasit.de" target="_blank" rel="noopener noreferrer" className="card-btn">
                  <i className="me-2 text-body-secondary fas fa-home"></i>
                  Homepage
                </a>
                <a href="https://github.com/cabroe/schichtplaner/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="card-btn">
                  <i className="me-2 text-body-secondary fas fa-book"></i>
                  Dokumentation
                </a>
              </div>
              <div className="card-footer">
                Made with ♥ by <a href="https://www.kasit.de/" target="_blank" rel="noopener noreferrer">Carsten Bröckert</a>.
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">Credits</h3>
                <div className="card-actions"></div>
              </div>
              <div className="card-body credits_card">
                <p>
                  Die folgenden großartigen Software-Bibliotheken wurden bei der Erstellung von Schichtplaner verwendet. 
                  Es wäre ohne sie nicht möglich gewesen. Mein größter Dank geht an die Autoren 👍
                </p>
                <ul>
                  <li>React: <a href="https://react.dev" target="_blank" rel="noopener noreferrer">https://react.dev</a></li>
                  <li>TypeScript: <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer">https://www.typescriptlang.org</a></li>
                  <li>Vite: <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">https://vitejs.dev</a></li>
                  <li>Tabler: <a href="https://tabler.io" target="_blank" rel="noopener noreferrer">https://tabler.io</a></li>
                  <li>FontAwesome: <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer">https://fontawesome.com</a></li>
                  <li>React Router: <a href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">https://reactrouter.com</a></li>
                  <li>Zustand: <a href="https://zustand-demo.pmnd.rs" target="_blank" rel="noopener noreferrer">https://zustand-demo.pmnd.rs</a></li>
                  <li>Vitest: <a href="https://vitest.dev" target="_blank" rel="noopener noreferrer">https://vitest.dev</a></li>
                  <li>Echo (Go): <a href="https://echo.labstack.com" target="_blank" rel="noopener noreferrer">https://echo.labstack.com</a></li>
                  <li>GORM: <a href="https://gorm.io" target="_blank" rel="noopener noreferrer">https://gorm.io</a></li>
                  <li>SQLite: <a href="https://sqlite.org" target="_blank" rel="noopener noreferrer">https://sqlite.org</a></li>
                </ul>
              </div>
              <div className="card-footer">
                Entschuldigung an alle Projekte, die ich vergessen habe zu erwähnen. 
                Bitte zögern Sie nicht und senden Sie einen PR, um das zu korrigieren!
              </div>
            </div>
          </div>
        </div>
        <div className="row row-cards mb-3">
          <div className="col-lg-8">
            <div className="card card-lg">
              <div className="card-body card_license">
                <div className="markdown">
                  <h3>Lizenz</h3>
                  <div style={{ whiteSpace: "pre" }}>
                    MIT License

                    Copyright (c) 2024 Carsten Bröckert

                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:

                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.

                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body card_details">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <i className="fa-2x fas fa-balance-scale"></i>
                  </div>
                  <div>
                    <small className="text-body-secondary">Schichtplaner ist lizenziert unter der</small>
                    <h3 className="lh-1">MIT License</h3>
                  </div>
                </div>
                <div className="text-body-secondary mb-3">
                  Eine einfache und permissive Lizenz, die nur die Erhaltung des Copyright-Hinweises erfordert. 
                  Lizenznehmer können die Software für jeden Zweck verwenden, modifizieren und verteilen.
                </div>
                <h4>Berechtigungen</h4>
                <ul className="list-unstyled space-y-1">
                  <li><i className="fas fa-check text-green"></i> Kommerzielle Nutzung</li>
                  <li><i className="fas fa-check text-green"></i> Modifikation</li>
                  <li><i className="fas fa-check text-green"></i> Verteilung</li>
                  <li><i className="fas fa-check text-green"></i> Private Nutzung</li>
                  <li><i className="fas fa-check text-green"></i> Patentnutzung</li>
                </ul>
                <h4>Einschränkungen</h4>
                <ul className="list-unstyled space-y-1">
                  <li><i className="fas fa-times text-red"></i> Haftung</li>
                  <li><i className="fas fa-times text-red"></i> Gewährleistung</li>
                </ul>
                <h4>Bedingungen</h4>
                <ul className="list-unstyled space-y-1">
                  <li><i className="fas fa-info-circle text-blue"></i> Copyright-Hinweis</li>
                  <li><i className="fas fa-info-circle text-blue"></i> Lizenz-Hinweis</li>
                </ul>
              </div>
              <div className="card-footer">
                Dies ist keine Rechtsberatung. Erfahren Sie mehr über diese Lizenz bei
                <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="noopener noreferrer"> choosealicense.com</a>.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 