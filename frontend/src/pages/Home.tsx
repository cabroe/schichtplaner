import { useEffect, useState } from 'react'

function Home() {
  const [messageFromServer, setMessageFromServer] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/message')
      const data = await response.json()
      setMessageFromServer(data.message)
    }

    fetchData().catch((e) => console.error(e))
  }, [])

  return (
    <div className="page-header d-print-none">
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">
              Schichtplaner Dashboard
            </h2>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Server Status</h3>
                  <p className="text-muted">{messageFromServer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
