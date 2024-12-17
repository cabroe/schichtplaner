import { useEffect, useState } from 'react'
import { Department } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { DepartmentTable } from "@/components/department/table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { DepartmentDialog } from "@/components/department/dialog"

interface DepartmentFormData {
  name: string
  color: string
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(API_ROUTES.DEPARTMENTS, API_CONFIG)
      const result = await response.json()
      setDepartments(Array.isArray(result.data) ? result.data : [result.data])
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async (data: DepartmentFormData) => {
    try {
      const response = await fetch(API_ROUTES.DEPARTMENTS, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify(data)
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Fehler beim Erstellen:', error)
    }
  }

  const handleUpdateDepartment = async (data: DepartmentFormData & { id: number }) => {
    try {
      const response = await fetch(`${API_ROUTES.DEPARTMENTS}/${data.id}`, {
        ...API_CONFIG,
        method: 'PUT',
        body: JSON.stringify(data)
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error)
    }
  }

  const handleDeleteDepartment = async (department: Department) => {
    try {
      const response = await fetch(`${API_ROUTES.DEPARTMENTS}/${department.id}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleSubmit = (data: DepartmentFormData) => {
    if (selectedDepartment) {
      handleUpdateDepartment({ ...data, id: selectedDepartment.id })
    } else {
      handleCreateDepartment(data)
    }
    setShowDialog(false)
    setSelectedDepartment(undefined)
  }

  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Lade Abteilungsdaten...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Abteilungen</h1>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Abteilung hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Abteilung suchen..."
        />
      </div>

      <DepartmentTable 
        departments={filteredDepartments}
        onEdit={(department) => {
          setSelectedDepartment(department)
          setShowDialog(true)
        }}
        onDelete={handleDeleteDepartment}
      />

      <DepartmentDialog 
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false)
          setSelectedDepartment(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={selectedDepartment}
      />
    </div>
  )
}
