import { PREDEFINED_COLORS } from '@/lib/colors'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Employee } from "@/types/api"
import { Edit, Trash2 } from "lucide-react"

interface EmployeeTableProps {
  employees: Employee[]
  getDepartmentName: (departmentId: number) => string
  getDepartmentColor: (departmentId: number) => string
  onEdit: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
}

export function EmployeeTable({ employees, getDepartmentName, getDepartmentColor, onEdit, onDelete }: EmployeeTableProps) {
  const getColorLabel = (colorValue: string) => {
    const color = PREDEFINED_COLORS.find(c => c.value === colorValue)
    return color?.label || colorValue
  }

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Abteilung</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Farbe</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={`employee-${employee.id}`}>
              <TableCell className="font-medium">
                {employee.first_name} {employee.last_name}
              </TableCell>
              <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ 
                    backgroundColor: `${getDepartmentColor(employee.department_id)}20`, 
                    color: getDepartmentColor(employee.department_id)
                  }}>
                    {getDepartmentName(employee.department_id)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {employee.is_admin ? (
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Mitarbeiter
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">                      
                      Admin
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Mitarbeiter
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ 
                    backgroundColor: `${employee.color}20`, 
                    color: employee.color 
                  }}>
                    {getColorLabel(employee.color)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(employee)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
