import React, { useState, useMemo } from 'react';
import { DataTable, Table, TableBody, TableCell, TableHeader, TableRow } from '../components-new/tables';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

const DataTableDemoNeu: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Beispieldaten
  const users: User[] = [
    { id: 1, name: "Max Mustermann", email: "max@example.com", role: "Admin", status: "Aktiv", lastLogin: "2024-01-15" },
    { id: 2, name: "Anna Schmidt", email: "anna@example.com", role: "User", status: "Aktiv", lastLogin: "2024-01-14" },
    { id: 3, name: "Tom Weber", email: "tom@example.com", role: "Editor", status: "Inaktiv", lastLogin: "2024-01-10" },
    { id: 4, name: "Lisa Müller", email: "lisa@example.com", role: "User", status: "Aktiv", lastLogin: "2024-01-13" },
    { id: 5, name: "Hans Bauer", email: "hans@example.com", role: "Admin", status: "Aktiv", lastLogin: "2024-01-12" },
    { id: 6, name: "Sarah Klein", email: "sarah@example.com", role: "User", status: "Inaktiv", lastLogin: "2024-01-08" },
    { id: 7, name: "Michael Wolf", email: "michael@example.com", role: "Editor", status: "Aktiv", lastLogin: "2024-01-11" },
    { id: 8, name: "Julia Fischer", email: "julia@example.com", role: "User", status: "Aktiv", lastLogin: "2024-01-09" },
  ];

  const products: Product[] = [
    { id: 1, name: "Laptop Pro", category: "Elektronik", price: 999.99, stock: 15, rating: 4.5 },
    { id: 2, name: "Gaming Mouse", category: "Zubehör", price: 29.99, stock: 42, rating: 4.2 },
    { id: 3, name: "Mechanical Keyboard", category: "Zubehör", price: 89.99, stock: 8, rating: 4.8 },
    { id: 4, name: "4K Monitor", category: "Elektronik", price: 299.99, stock: 12, rating: 4.6 },
    { id: 5, name: "Wireless Headphones", category: "Audio", price: 149.99, stock: 25, rating: 4.3 },
    { id: 6, name: "USB-C Hub", category: "Zubehör", price: 19.99, stock: 35, rating: 4.0 },
    { id: 7, name: "Webcam HD", category: "Elektronik", price: 79.99, stock: 18, rating: 4.4 },
    { id: 8, name: "Bluetooth Speaker", category: "Audio", price: 59.99, stock: 30, rating: 4.1 },
  ];

  // Sortierte und paginierte Daten
  const sortedUsers = useMemo(() => {
    if (!sortBy) return users;
    
    return [...users].sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [users, sortBy, sortDirection]);

  const sortedProducts = useMemo(() => {
    if (!sortBy) return products;
    
    return [...products].sort((a, b) => {
      const aValue = a[sortBy as keyof Product];
      const bValue = b[sortBy as keyof Product];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [products, sortBy, sortDirection]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUserSelectionChange = (selectedRows: string[]) => {
    setSelectedUsers(selectedRows);
  };

  // Entfernt, da nicht verwendet
  // const handleProductSelectionChange = (selectedRows: string[]) => {
  //   setSelectedProducts(selectedRows);
  // };

  // DataTable Spalten für Benutzer
  const userColumns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px',
      align: 'center' as const,
      sortable: true,
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value: string, _row: User) => (
        <div className="d-flex align-items-center">
          <span className="avatar avatar-sm me-2 bg-primary">
            {value.charAt(0)}
          </span>
          {value}
        </div>
      ),
    },
    {
      key: 'email',
      title: 'E-Mail',
      sortable: true,
    },
    {
      key: 'role',
      title: 'Rolle',
      sortable: true,
      render: (value: string) => (
        <span className={`badge bg-${value === 'Admin' ? 'danger' : value === 'Editor' ? 'warning' : 'primary'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`badge bg-${value === 'Aktiv' ? 'success' : 'secondary'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Letzter Login',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('de-DE'),
    },
  ];

  // DataTable Spalten für Produkte
  const productColumns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px',
      align: 'center' as const,
      sortable: true,
    },
    {
      key: 'name',
      title: 'Produkt',
      sortable: true,
      render: (value: string, _row: Product) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-sm me-2 bg-secondary">
            {value.charAt(0)}
          </div>
          {value}
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Kategorie',
      sortable: true,
    },
    {
      key: 'price',
      title: 'Preis',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => (
        <strong>{value.toFixed(2)} €</strong>
      ),
    },
    {
      key: 'stock',
      title: 'Lagerbestand',
      align: 'center' as const,
      sortable: true,
      render: (value: number) => (
        <span className={`badge bg-${value > 20 ? 'success' : value > 10 ? 'warning' : 'danger'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'rating',
      title: 'Bewertung',
      align: 'center' as const,
      sortable: true,
      render: (value: number) => (
        <div className="d-flex align-items-center">
          <span className="me-1">{value.toFixed(1)}</span>
          <div className="text-warning">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star${i < Math.floor(value) ? '' : '-o'}`} />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">DataTable Demo - Neue Komponenten</h3>
              <div className="card-actions">
                <span className="badge bg-primary me-2">
                  {selectedUsers.length} Benutzer ausgewählt
                </span>
              </div>
            </div>
            <div className="card-body">
              
              {/* DataTable Komponente - Benutzer */}
              <div className="mb-5">
                <h4>Benutzer-Tabelle (DataTable Komponente)</h4>
                <p className="text-muted mb-3">
                  Vollständige DataTable mit Sortierung, Pagination, Auswahl und Aktionen
                </p>
                
                <DataTable
                  data={paginatedUsers}
                  columns={userColumns}
                  hover={true}
                  striped={true}
                  bordered={false}
                  compact={false}
                  responsive={true}
                  sorting={{
                    sortBy,
                    sortDirection,
                    onSort: handleSort,
                  }}
                  selection={{
                    selectedRows: selectedUsers,
                    onSelectionChange: handleUserSelectionChange,
                    rowKey: 'id',
                  }}
                  pagination={{
                    currentPage,
                    totalPages,
                    totalItems: sortedUsers.length,
                    itemsPerPage,
                    onPageChange: handlePageChange,
                  }}
                  actions={{
                    title: 'Aktionen',
                    render: (_row: User) => (
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary" title="Bearbeiten">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Löschen">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    ),
                  }}
                  emptyState={
                    <div className="text-center py-4">
                      <i className="fas fa-users fa-3x text-muted mb-3" />
                      <p className="text-muted">Keine Benutzer gefunden</p>
                    </div>
                  }
                />
              </div>

              {/* Table Komponente - Produkte */}
              <div className="mb-5">
                <h4>Produkt-Tabelle (Table Komponente)</h4>
                <p className="text-muted mb-3">
                  Einfache Table mit Sortierung und Hover-Effekten
                </p>
                
                <Table
                  columns={productColumns}
                  data={sortedProducts}
                  sortable={true}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  hover={true}
                  striped={true}
                  bordered={false}
                  compact={false}
                  responsive={true}
                  onRowClick={(row) => console.log('Produkt geklickt:', row)}
                  emptyState={
                    <div className="text-center py-4">
                      <i className="fas fa-box fa-3x text-muted mb-3" />
                      <p className="text-muted">Keine Produkte gefunden</p>
                    </div>
                  }
                />
              </div>

              {/* Manuelle Tabellen-Komponenten */}
              <div className="mb-5">
                <h4>Manuelle Tabellen-Komponenten</h4>
                <p className="text-muted mb-3">
                  Verwendung der einzelnen Tabellen-Komponenten (TableHeader, TableBody, TableRow, TableCell)
                </p>
                
                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead>
                      <tr>
                        <TableHeader sortable={true} sortDirection={sortBy === 'name' ? sortDirection : null} onSort={() => handleSort('name', sortDirection === 'asc' ? 'desc' : 'asc')}>
                          Name
                        </TableHeader>
                        <TableHeader align="center">Rolle</TableHeader>
                        <TableHeader align="right">Status</TableHeader>
                        <TableHeader align="center" width="100px">Aktionen</TableHeader>
                      </tr>
                    </thead>
                    <TableBody>
                      {users.slice(0, 3).map((user) => (
                        <TableRow key={user.id} onClick={() => console.log('Benutzer geklickt:', user)}>
                          <TableCell>
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-sm me-2 bg-primary">
                                {user.name.charAt(0)}
                              </span>
                              {user.name}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <span className={`badge bg-${user.role === 'Admin' ? 'danger' : user.role === 'Editor' ? 'warning' : 'primary'}`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell align="right">
                            <span className={`badge bg-${user.status === 'Aktiv' ? 'success' : 'secondary'}`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <div className="btn-group">
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-edit" />
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="fas fa-trash" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </div>

              {/* Features Übersicht */}
              <div className="mt-5">
                <h5>Features der neuen Tabellen-Komponenten:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>DataTable Komponente:</h6>
                    <ul>
                      <li><strong>Vollständige Funktionalität:</strong> Sortierung, Pagination, Auswahl, Aktionen</li>
                      <li><strong>Flexible Spalten-Definition:</strong> Render-Funktionen, Ausrichtung, Breite</li>
                      <li><strong>Responsive Design:</strong> Automatische Anpassung an Bildschirmgrößen</li>
                      <li><strong>Loading States:</strong> Integrierte Lade-Zustände</li>
                      <li><strong>Empty States:</strong> Anpassbare Leer-Zustände</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Table Komponente:</h6>
                    <ul>
                      <li><strong>Einfache Verwendung:</strong> Grundlegende Tabellen-Funktionalität</li>
                      <li><strong>Sortierung:</strong> Einfache Spalten-Sortierung</li>
                      <li><strong>Row Click Events:</strong> Klick-Handler für Zeilen</li>
                      <li><strong>Styling-Optionen:</strong> Hover, Striped, Bordered, Compact</li>
                      <li><strong>Accessibility:</strong> Keyboard-Navigation und ARIA-Support</li>
                    </ul>
                  </div>
                </div>
                
                <h6 className="mt-3">Einzelne Komponenten:</h6>
                <ul>
                  <li><strong>TableHeader:</strong> Sortierbare Header mit Icons</li>
                  <li><strong>TableBody:</strong> Loading und Empty States</li>
                  <li><strong>TableRow:</strong> Interaktive Zeilen mit Events</li>
                  <li><strong>TableCell:</strong> Flexible Zellen mit Ausrichtung und Styling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemoNeu; 