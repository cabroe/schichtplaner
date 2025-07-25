import React, { useState } from "react";
import { DataTable } from "../components";

const DataTableDemo: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'sm' | 'lg' | undefined>(undefined);
  const [isStriped, setIsStriped] = useState(false);
  const [isBordered, setIsBordered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Beispieldaten
  const users = [
    { id: 1, name: "Max Mustermann", email: "max@example.com", role: "Admin", status: "Aktiv" },
    { id: 2, name: "Anna Schmidt", email: "anna@example.com", role: "User", status: "Aktiv" },
    { id: 3, name: "Tom Weber", email: "tom@example.com", role: "Editor", status: "Inaktiv" },
    { id: 4, name: "Lisa Müller", email: "lisa@example.com", role: "User", status: "Aktiv" },
    { id: 5, name: "Hans Bauer", email: "hans@example.com", role: "Admin", status: "Aktiv" },
  ];

  const products = [
    { id: 1, name: "Laptop", category: "Elektronik", price: "999,00 €", stock: 15 },
    { id: 2, name: "Mouse", category: "Zubehör", price: "29,99 €", stock: 42 },
    { id: 3, name: "Keyboard", category: "Zubehör", price: "89,99 €", stock: 8 },
    { id: 4, name: "Monitor", category: "Elektronik", price: "299,00 €", stock: 12 },
    { id: 5, name: "Headphones", category: "Audio", price: "149,99 €", stock: 25 },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">DataTable Demo</h3>
          <div className="card-actions">
            <div className="btn-group" role="group">
              <input
                type="checkbox"
                className="btn-check"
                id="striped"
                checked={isStriped}
                onChange={(e) => setIsStriped(e.target.checked)}
              />
              <label className="btn btn-outline-primary" htmlFor="striped">
                Gestreift
              </label>
              
              <input
                type="checkbox"
                className="btn-check"
                id="bordered"
                checked={isBordered}
                onChange={(e) => setIsBordered(e.target.checked)}
              />
              <label className="btn btn-outline-primary" htmlFor="bordered">
                Rahmen
              </label>
              
              <input
                type="checkbox"
                className="btn-check"
                id="darkMode"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              <label className="btn btn-outline-primary" htmlFor="darkMode">
                Dark Mode
              </label>
            </div>
            
            <div className="btn-group ms-2" role="group">
              <input
                type="radio"
                className="btn-check"
                name="size"
                id="size-default"
                checked={selectedSize === undefined}
                onChange={() => setSelectedSize(undefined)}
              />
              <label className="btn btn-outline-secondary" htmlFor="size-default">
                Standard
              </label>
              
              <input
                type="radio"
                className="btn-check"
                name="size"
                id="size-sm"
                checked={selectedSize === 'sm'}
                onChange={() => setSelectedSize('sm')}
              />
              <label className="btn btn-outline-secondary" htmlFor="size-sm">
                Klein
              </label>
              
              <input
                type="radio"
                className="btn-check"
                name="size"
                id="size-lg"
                checked={selectedSize === 'lg'}
                onChange={() => setSelectedSize('lg')}
              />
              <label className="btn btn-outline-secondary" htmlFor="size-lg">
                Groß
              </label>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h4>Benutzer-Tabelle</h4>
          <DataTable
            striped={isStriped}
            bordered={isBordered}
            size={selectedSize}
            darkMode={isDarkMode}
            responsive="lg"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm me-2">
                        {user.name.charAt(0)}
                      </span>
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge bg-${user.role === 'Admin' ? 'danger' : user.role === 'Editor' ? 'warning' : 'primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${user.status === 'Aktiv' ? 'success' : 'secondary'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          <h4 className="mt-4">Produkt-Tabelle</h4>
          <DataTable
            striped={isStriped}
            bordered={isBordered}
            size={selectedSize}
            darkMode={isDarkMode}
            responsive="md"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Produkt</th>
                <th>Kategorie</th>
                <th>Preis</th>
                <th>Lagerbestand</th>
                <th>Verfügbarkeit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm me-2 bg-primary">
                        {product.name.charAt(0)}
                      </div>
                      {product.name}
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <strong>{product.price}</strong>
                  </td>
                  <td>
                    <span className={`badge bg-${product.stock > 20 ? 'success' : product.stock > 10 ? 'warning' : 'danger'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="progress progress-sm">
                      <div 
                        className={`progress-bar bg-${product.stock > 20 ? 'success' : product.stock > 10 ? 'warning' : 'danger'}`}
                        style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          <div className="mt-4">
            <h5>Features der DataTable-Komponente:</h5>
            <ul>
              <li><strong>Responsive:</strong> Automatische Anpassung an verschiedene Bildschirmgrößen</li>
              <li><strong>Striped:</strong> Gestreifte Zeilen für bessere Lesbarkeit</li>
              <li><strong>Bordered:</strong> Rahmen um die Tabelle</li>
              <li><strong>Size:</strong> Verschiedene Tabellengrößen (sm, lg)</li>
              <li><strong>Dark Mode:</strong> Dunkles Theme für die Tabelle</li>
              <li><strong>Hover Effects:</strong> Automatische Hover-Effekte</li>
              <li><strong>Vertical Centering:</strong> Vertikal zentrierte Zellen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemo; 