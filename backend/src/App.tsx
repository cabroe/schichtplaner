import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/layout'
import LoginPage from './app/login/page'
import DashboardPage from './app/dashboard/page'
import EmployeePage from './app/employee/page'
import DepartmentPage from './app/department/page'
import ShiftTypePage from './app/shifttype/page'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <Layout>
              <DashboardPage />
            </Layout>
          } />
          <Route path="/employees" element={
            <Layout>
              <EmployeePage />
            </Layout>
          } />
          <Route path="/departments" element={
            <Layout>
              <DepartmentPage />
            </Layout>
          } />
          <Route path="/shifttype" element={
            <Layout>
              <ShiftTypePage />
            </Layout>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
