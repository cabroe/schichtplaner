import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/Layout'
import { Dashboard, TimeTracking, Administration } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
        <Route path="/zeiterfassung" element={
          <MainLayout>
            <TimeTracking />
          </MainLayout>
        } />
        <Route path="/administration" element={
          <MainLayout>
            <Administration />
          </MainLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App
