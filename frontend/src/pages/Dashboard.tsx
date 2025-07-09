import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
)

interface DashboardStats {
  healthStatus: string
  employeeCount: number
  shiftCount: number
  recentShifts: any[]
  recentEmployees: any[]
}

interface LoadingStates {
  health: boolean
  employees: boolean
  shifts: boolean
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    healthStatus: 'loading',
    employeeCount: 0,
    shiftCount: 0,
    recentShifts: [],
    recentEmployees: []
  })
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    health: true,
    employees: true,
    shifts: true
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch health status
      fetch('/api/health')
        .then(res => res.json())
        .then(health => {
          setStats(prev => ({ ...prev, healthStatus: health.status }))
          setLoadingStates(prev => ({ ...prev, health: false }))
        })
        .catch(error => {
          console.error('Error fetching health:', error)
          setStats(prev => ({ ...prev, healthStatus: 'error' }))
          setLoadingStates(prev => ({ ...prev, health: false }))
        })

      // Fetch employees
      fetch('/api/employees')
        .then(res => res.json())
        .then(employees => {
          const employeeArray = Array.isArray(employees) ? employees : []
          setStats(prev => ({
            ...prev,
            employeeCount: employeeArray.length,
            recentEmployees: employeeArray.slice(0, 5)
          }))
          setLoadingStates(prev => ({ ...prev, employees: false }))
        })
        .catch(error => {
          console.error('Error fetching employees:', error)
          setLoadingStates(prev => ({ ...prev, employees: false }))
        })

      // Fetch shifts
      fetch('/api/shifts')
        .then(res => res.json())
        .then(shifts => {
          const shiftArray = Array.isArray(shifts) ? shifts : []
          setStats(prev => ({
            ...prev,
            shiftCount: shiftArray.length,
            recentShifts: shiftArray.slice(0, 5)
          }))
          setLoadingStates(prev => ({ ...prev, shifts: false }))
        })
        .catch(error => {
          console.error('Error fetching shifts:', error)
          setLoadingStates(prev => ({ ...prev, shifts: false }))
        })
    }

    fetchDashboardData()
  }, [])

  // Chart data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#666',
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 11,
          },
        },
      },
    },
  }

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [12, 19, 15, 17, 24, 16],
        backgroundColor: 'rgba(32, 107, 196, 0.8)',
        borderColor: 'rgba(32, 107, 196, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const lineChartData = {
    labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    datasets: [
      {
        data: [8, 12, 6, 14, 18, 16, 10],
        borderColor: 'rgba(47, 179, 68, 1)',
        backgroundColor: 'rgba(47, 179, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(47, 179, 68, 1)',
      },
    ],
  }

  const doughnutData = {
    labels: ['Aktive', 'Pausiert', 'Abgeschlossen'],
    datasets: [
      {
        data: [stats.employeeCount || 1, 2, 3],
        backgroundColor: [
          'rgba(32, 107, 196, 0.8)',
          'rgba(247, 103, 7, 0.8)',
          'rgba(47, 179, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  }

  const Skeleton = ({ height = '20px', width = '100%' }: { height?: string; width?: string }) => (
    <div 
      className="placeholder-glow"
      style={{ height, width }}
    >
      <div className="placeholder w-100 h-100"></div>
    </div>
  )

  return (
    <div className="row row-deck row-cards">
      {/* Stats Cards Row */}
      <div className="col-sm-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="subheader">Server Status</div>
              <div className="ms-auto">
                <span className="text-green d-inline-flex align-items-center lh-1">
                  {loadingStates.health ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <i className="fas fa-server fs-4"></i>
                  )}
                </span>
              </div>
            </div>
            <div className="h1 mb-3">
              {loadingStates.health ? (
                <Skeleton height="32px" width="80px" />
              ) : (
                <span className={`badge ${stats.healthStatus === 'ok' ? 'bg-green' : stats.healthStatus === 'error' ? 'bg-red' : 'bg-yellow'}`}>
                  {stats.healthStatus === 'ok' ? 'Online' : stats.healthStatus === 'error' ? 'Offline' : 'Lädt...'}
                </span>
              )}
            </div>
            <div className="d-flex mb-2">
              <div className="text-muted">System Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="subheader">Mitarbeiter</div>
              <div className="ms-auto">
                <span className="text-blue d-inline-flex align-items-center lh-1">
                  {loadingStates.employees ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <i className="fas fa-users fs-4"></i>
                  )}
                </span>
              </div>
            </div>
            <div className="h1 mb-3">
              {loadingStates.employees ? (
                <Skeleton height="32px" width="60px" />
              ) : (
                stats.employeeCount
              )}
            </div>
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
              <div className="ms-auto">
                <span className="text-green d-inline-flex align-items-center lh-1">
                  {loadingStates.shifts ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <i className="fas fa-clock fs-4"></i>
                  )}
                </span>
              </div>
            </div>
            <div className="h1 mb-3">
              {loadingStates.shifts ? (
                <Skeleton height="32px" width="60px" />
              ) : (
                stats.shiftCount
              )}
            </div>
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
              <div className="subheader">Auslastung</div>
              <div className="ms-auto">
                <span className="text-orange d-inline-flex align-items-center lh-1">
                  <i className="fas fa-chart-line fs-4"></i>
                </span>
              </div>
            </div>
            <div className="h1 mb-3">
              <span className="text-green">87%</span>
            </div>
            <div className="d-flex mb-2">
              <div className="text-muted">Durchschnittliche Auslastung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Schichten pro Monat</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Status Verteilung</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              <Doughnut 
                data={doughnutData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom' as const,
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Wöchentliche Aktivität</h3>
            <div className="card-actions">
              <a href="#" className="btn btn-primary btn-sm">
                <i className="fas fa-download me-1"></i>
                Export
              </a>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: '200px' }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Lists */}
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-users me-2 text-blue"></i>
              Aktuelle Mitarbeiter
            </h3>
            <div className="card-actions">
              <a href="#" className="text-muted">
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
          <div className="card-body p-0">
            {loadingStates.employees ? (
              <div className="list-group list-group-flush">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="avatar placeholder"></div>
                      </div>
                      <div className="col">
                        <Skeleton height="16px" width="150px" />
                        <div className="mt-1">
                          <Skeleton height="14px" width="200px" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.recentEmployees.length > 0 ? (
              <div className="list-group list-group-flush">
                {stats.recentEmployees.map((employee, index) => (
                  <div key={employee.id || index} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="avatar bg-blue text-white">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </span>
                      </div>
                      <div className="col text-truncate">
                        <strong>{employee.firstName} {employee.lastName}</strong>
                        <div className="text-muted">{employee.email}</div>
                      </div>
                      <div className="col-auto">
                        <span className="badge bg-green-lt">Aktiv</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body text-center text-muted">
                <i className="fas fa-users fs-3 mb-3 text-muted"></i>
                <div>Keine Mitarbeiter vorhanden</div>
                <small>Fügen Sie den ersten Mitarbeiter hinzu</small>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-clock me-2 text-green"></i>
              Aktuelle Schichten
            </h3>
            <div className="card-actions">
              <a href="#" className="text-muted">
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
          <div className="card-body p-0">
            {loadingStates.shifts ? (
              <div className="list-group list-group-flush">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="avatar placeholder bg-blue"></div>
                      </div>
                      <div className="col">
                        <Skeleton height="16px" width="120px" />
                        <div className="mt-1">
                          <Skeleton height="14px" width="180px" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.recentShifts.length > 0 ? (
              <div className="list-group list-group-flush">
                {stats.recentShifts.map((shift, index) => (
                  <div key={shift.id || index} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="avatar bg-green text-white">
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
                      <div className="col-auto">
                        <span className="badge bg-blue-lt">Geplant</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-body text-center text-muted">
                <i className="fas fa-clock fs-3 mb-3 text-muted"></i>
                <div>Keine Schichten vorhanden</div>
                <small>Planen Sie die erste Schicht</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
