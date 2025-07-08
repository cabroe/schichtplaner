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
    <>
      <h1>Golang + Vite + React</h1>
      <h2>{messageFromServer}</h2>
    </>
  )
}

export default Home
