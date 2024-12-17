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
  onEdit: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
}

export function EmployeeTable({ employees, getDepartmentName, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Farbe</TableHead>
            <TableHead>Abteilung</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
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
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ 
                    backgroundColor: `${employee.color}20`, 
                    color: employee.color 
                  }}>
                    {employee.color}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getDepartmentName(employee.department_id)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {employee.is_admin ? (
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="w-2 h-2 mr-1.5 fill-current" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
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
