import { useEffect, useState } from 'react'
import { Employee, Department } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { EmployeeTable } from "@/components/employee-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesResponse, departmentsResponse] = await Promise.all([
          fetch(API_ROUTES.EMPLOYEES, API_CONFIG),
          fetch(API_ROUTES.DEPARTMENTS, API_CONFIG)
        ])

        const employeesResult = await employeesResponse.json()
        const departmentsResult = await departmentsResponse.json()

        setEmployees(Array.isArray(employeesResult.data) ? employeesResult.data : [employeesResult.data])
        setDepartments(departmentsResult.data)
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getDepartmentName = (departmentId: number) => {
    const department = departments.find(d => d.id === departmentId)
    return department ? department.name : `Abteilung ${departmentId}`
  }

  const filteredEmployees = employees.filter(employee => 
    employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Lade Mitarbeiterdaten...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mitarbeiter</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Mitarbeiter hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Mitarbeiter suchen..."
        />
      </div>

      <EmployeeTable 
        employees={filteredEmployees}
        getDepartmentName={getDepartmentName}
      />
    </div>
  )
}