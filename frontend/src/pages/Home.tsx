import { useEffect, useState } from 'react'

function Home() {
  const [healthStatus, setHealthStatus] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthStatus(data.status)
    }

    fetchData().catch((e) => console.error(e))
  }, [])

  return (
    <div className="row row-deck row-cards">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Server Status</h3>
            <p className="text-muted">Status: {healthStatus}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
