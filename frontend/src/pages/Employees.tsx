import { useEffect, useState } from 'react'

interface Employee {
  id: number
  name: string
  email: string
  position: string
  role: string
  created_at: string
  updated_at: string
}

interface EmployeeForm {
  name: string
  email: string
  position: string
  role: string
}

interface PaginatedResponse {
  data: Employee[]
  total: number
  limit: number
  offset: number
  has_more: boolean
  total_pages: number
}

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    has_more: false,
    total_pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState<EmployeeForm>({
    name: '',
    email: '',
    position: '',
    role: 'user'
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const fetchEmployees = async (offset = 0) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/employees?limit=${pagination.limit}&offset=${offset}`)
      if (response.ok) {
        const data: PaginatedResponse = await response.json()
        setEmployees(data.data)
        setPagination({
          total: data.total,
          limit: data.limit,
          offset: data.offset,
          has_more: data.has_more,
          total_pages: data.total_pages
        })
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handlePageChange = (newOffset: number) => {
    fetchEmployees(newOffset)
  }

  const openCreateModal = () => {
    setEditingEmployee(null)
    setFormData({ name: '', email: '', position: '', role: 'user' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      role: employee.role
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEmployee(null)
    setFormData({ name: '', email: '', position: '', role: 'user' })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name ist erforderlich'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ungültige E-Mail-Adresse'
    }
    
    if (!formData.role) {
      errors.role = 'Rolle ist erforderlich'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const url = editingEmployee 
        ? `/api/employees/${editingEmployee.id}`
        : '/api/employees'
      
      const method = editingEmployee ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchEmployees(pagination.offset)
        closeModal()
      } else {
        const errorData = await response.json()
        console.error('Error saving employee:', errorData)
      }
    } catch (error) {
      console.error('Error saving employee:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEmployees(pagination.offset)
        setDeleteConfirm(null)
      } else {
        console.error('Error deleting employee')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red text-white'
      case 'manager': return 'bg-yellow text-dark'
      case 'user': return 'bg-blue text-white'
      default: return 'bg-gray text-white'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'manager': return 'Manager'
      case 'user': return 'Benutzer'
      default: return role
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  const Skeleton = () => (
    <tr>
      <td><div className="placeholder-glow"><div className="placeholder w-100"></div></div></td>
      <td><div className="placeholder-glow"><div className="placeholder w-100"></div></div></td>
      <td><div className="placeholder-glow"><div className="placeholder w-100"></div></div></td>
      <td><div className="placeholder-glow"><div className="placeholder w-100"></div></div></td>
      <td><div className="placeholder-glow"><div className="placeholder w-100"></div></div></td>
      <td><div className="placeholder-glow"><div className="placeholder w-100"></div></div></td>
    </tr>
  )

  return (
    <div className="row row-deck row-cards">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-users me-2"></i>
              Mitarbeiter
            </h3>
            <div className="card-actions">
              <button 
                className="btn btn-primary"
                onClick={openCreateModal}
              >
                <i className="fas fa-plus me-1"></i>
                Neuer Mitarbeiter
              </button>
            </div>
          </div>
          
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Position</th>
                    <th>Rolle</th>
                    <th>Erstellt</th>
                    <th className="w-1">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>
                      {[...Array(pagination.limit)].map((_, index) => (
                        <Skeleton key={index} />
                      ))}
                    </>
                  ) : employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="avatar me-2 bg-blue text-white">
                              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                            <strong>{employee.name}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="text-muted">{employee.email}</div>
                        </td>
                        <td>
                          {employee.position || <span className="text-muted">Nicht festgelegt</span>}
                        </td>
                        <td>
                          <span className={`badge ${getRoleBadgeClass(employee.role)}`}>
                            {getRoleText(employee.role)}
                          </span>
                        </td>
                        <td className="text-muted">
                          {formatDate(employee.created_at)}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditModal(employee)}
                              title="Bearbeiten"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setDeleteConfirm(employee.id)}
                              title="Löschen"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        <i className="fas fa-users fs-3 mb-3 d-block"></i>
                        Keine Mitarbeiter vorhanden
                        <div className="mt-2">
                          <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
                            Ersten Mitarbeiter hinzufügen
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="card-footer d-flex align-items-center">
                <p className="m-0 text-muted">
                  Zeige {pagination.offset + 1} bis {Math.min(pagination.offset + pagination.limit, pagination.total)} von {pagination.total} Mitarbeitern
                </p>
                <ul className="pagination m-0 ms-auto">
                  <li className={`page-item ${pagination.offset === 0 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => handlePageChange(pagination.offset - pagination.limit)}
                      disabled={pagination.offset === 0}
                    >
                      <i className="fas fa-chevron-left"></i>
                      Zurück
                    </button>
                  </li>
                  
                  {[...Array(pagination.total_pages)].map((_, index) => {
                    const pageOffset = index * pagination.limit
                    const isActive = pageOffset === pagination.offset
                    return (
                      <li key={index} className={`page-item ${isActive ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pageOffset)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  })}
                  
                  <li className={`page-item ${!pagination.has_more ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                      disabled={!pagination.has_more}
                    >
                      Weiter
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal modal-blur fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingEmployee ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Name *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Vollständiger Name"
                        />
                        {formErrors.name && (
                          <div className="invalid-feedback">{formErrors.name}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">E-Mail *</label>
                        <input
                          type="email"
                          className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="name@example.com"
                        />
                        {formErrors.email && (
                          <div className="invalid-feedback">{formErrors.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Position</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          placeholder="z.B. Entwickler, Manager"
                        />
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Rolle *</label>
                        <select
                          className={`form-select ${formErrors.role ? 'is-invalid' : ''}`}
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                          <option value="user">Benutzer</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Administrator</option>
                        </select>
                        {formErrors.role && (
                          <div className="invalid-feedback">{formErrors.role}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Abbrechen
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-1"></i>
                    {editingEmployee ? 'Aktualisieren' : 'Erstellen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-blur fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mitarbeiter löschen</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteConfirm(null)}></button>
              </div>
              
              <div className="modal-body">
                <div className="text-center">
                  <i className="fas fa-exclamation-triangle text-danger fs-1 mb-3"></i>
                  <h4>Sind Sie sicher?</h4>
                  <p className="text-muted">
                    Diese Aktion kann nicht rückgängig gemacht werden. Der Mitarbeiter wird permanent gelöscht.
                  </p>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setDeleteConfirm(null)}
                >
                  Abbrechen
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  <i className="fas fa-trash me-1"></i>
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showModal || deleteConfirm) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  )
}

export default Employees
