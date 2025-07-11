import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import ModalTestPage from './pages/ModalTestPage'
import ContextMenuTestPage from './pages/ContextMenuTestPage'
import Employees from './pages/Employees'
import { MainLayout } from './components/MainLayout'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/modal-test" element={<ModalTestPage />} />
          <Route path="/context-menu-test" element={<ContextMenuTestPage />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
