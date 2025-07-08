import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <Router>
      <div className="page">
        <div className="page-wrapper">
          <header className="navbar navbar-expand-md navbar-light d-print-none">
            <div className="container-xl">
              <Navigation />
            </div>
          </header>
          <div className="page-body">
            <div className="container-xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
