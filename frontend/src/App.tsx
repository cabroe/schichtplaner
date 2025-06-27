import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReact } from '@fortawesome/free-brands-svg-icons'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import './App.css'

function App() {
  const [messageFromServer, setMessageFromServer] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/message')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON')
        }
        
        const data = await response.json()
        setMessageFromServer(data.message)
      } catch (error) {
        // Stille Fehlerbehandlung - API ist im Dev-Modus oft nicht verfügbar
        setMessageFromServer('API nicht erreichbar - läuft im Frontend-Modus')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="page">
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">
                  Schichtplaner
                </h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="page-body">
          <div className="container-xl">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="mb-4">
                      <div className="d-flex justify-content-center gap-4 mb-4">
                        <div className="avatar avatar-lg bg-primary text-white">
                        <FontAwesomeIcon icon={faBolt} size="2x" />
                        </div>
                        <div className="avatar avatar-lg bg-info text-white">
                        <FontAwesomeIcon icon={faReact} size="2x" />
                        </div>
                      </div>
                    </div>
                    
                    <h1 className="h2 mb-3">Golang + Vite + React</h1>
                    
                    {messageFromServer && (
                      <div className="alert alert-success" role="alert">
                        <h4 className="alert-title">Server Message</h4>
                        <div className="text-secondary">{messageFromServer}</div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="row g-2">
                        <div className="col-6 col-md-3">
                          <a href="https://vitejs.dev" target="_blank" className="btn btn-outline-primary w-100">
                          <FontAwesomeIcon icon={faBolt} className="me-2" />
                          Vite
                          </a>
                          </div>
                          <div className="col-6 col-md-3">
                          <a href="https://react.dev" target="_blank" className="btn btn-outline-info w-100">
                          <FontAwesomeIcon icon={faReact} className="me-2" />
                          React
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
