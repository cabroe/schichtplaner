import { useEffect, useState } from 'react'

interface DashboardStats {
  healthStatus: string
  employeeCount: number
  shiftCount: number
  recentShifts: any[]
  recentEmployees: any[]
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    healthStatus: '',
    employeeCount: 0,
    shiftCount: 0,
    recentShifts: [],
    recentEmployees: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [healthRes, employeesRes, shiftsRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/employees'),
          fetch('/api/shifts')
        ])

        const [health, employees, shifts] = await Promise.all([
          healthRes.json(),
          employeesRes.json(),
          shiftsRes.json()
        ])

        setStats({
          healthStatus: health.status,
          employeeCount: Array.isArray(employees) ? employees.length : 0,
          shiftCount: Array.isArray(shifts) ? shifts.length : 0,
          recentShifts: Array.isArray(shifts) ? shifts.slice(0, 5) : [],
          recentEmployees: Array.isArray(employees) ? employees.slice(0, 5) : []
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="row row-deck row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Lädt...</span>
              </div>
              <p className="mt-2 text-muted">Dashboard wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="row row-deck row-cards">
      {/* Stats Cards Row */}
      <div className="col-sm-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="subheader">Server Status</div>
            </div>
            <div className="h1 mb-3">
              <span className={`badge ${stats.healthStatus === 'ok' ? 'bg-green' : 'bg-red'}`}>
                {stats.healthStatus === 'ok' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="subheader">Mitarbeiter</div>
            </div>
            <div className="h1 mb-3">{stats.employeeCount}</div>
            <div className="d-flex mb-2">
              <div className="text-muted">Registrierte Mitarbeiter</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="subheader">Schichten</div>
            </div>
            <div className="h1 mb-3">{stats.shiftCount}</div>
            <div className="d-flex mb-2">
              <div className="text-muted">Geplante Schichten</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="subheader">System</div>
            </div>
            <div className="h1 mb-3">
              <i className="fas fa-chart-line text-green"></i>
            </div>
            <div className="d-flex mb-2">
              <div className="text-muted">Aktiv</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Aktuelle Mitarbeiter</h3>
          </div>
          <div className="card-body p-0">
            {stats.recentEmployees.length > 0 ? (
              <div className="list-group list-group-flush">
                {stats.recentEmployees.map((employee, index) => (
                  <div key={employee.id || index} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="avatar">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </span>
                      </div>
                      <div className="col text-truncate">
                        <strong>{employee.firstName} {employee.lastName}</strong>
                        <div className="text-muted">{employee.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body text-center text-muted">
                Keine Mitarbeiter vorhanden
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Aktuelle Schichten</h3>
          </div>
          <div className="card-body p-0">
            {stats.recentShifts.length > 0 ? (
              <div className="list-group list-group-flush">
                {stats.recentShifts.map((shift, index) => (
                  <div key={shift.id || index} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="avatar bg-blue text-white">
                          <i className="fas fa-clock"></i>
                        </span>
                      </div>
                      <div className="col text-truncate">
                        <strong>Schicht #{shift.id}</strong>
                        <div className="text-muted">
                          {shift.startTime && shift.endTime ? 
                            `${shift.startTime} - ${shift.endTime}` : 
                            'Zeiten nicht definiert'
                          }
                        </div>
                        {shift.employeeId && (
                          <div className="text-muted small">
                            Mitarbeiter ID: {shift.employeeId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body text-center text-muted">
                Keine Schichten vorhanden
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
