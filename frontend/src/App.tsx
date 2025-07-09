import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import ModalTestPage from './pages/ModalTestPage'
import { MainLayout } from './components/MainLayout'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/modal-test" element={<ModalTestPage />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
