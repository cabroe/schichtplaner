import { useEffect, useState } from 'react'
import { Header, Sidebar, PageWrapper } from './components/Layout'

function App() {
  const [messageFromServer, setMessageFromServer] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/message`)
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
        setMessageFromServer('API nicht erreichbar')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="page">
      <Sidebar />
      <Header />
      <PageWrapper>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h1>API Message</h1>
                <p>{messageFromServer}</p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default App
