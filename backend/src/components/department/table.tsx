import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Department } from "@/types/api"
import { Edit, Trash2 } from "lucide-react"

interface DepartmentTableProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onDelete?: (department: Department) => void
}

export function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden lg:table-cell">Farbe</TableHead>
            <TableHead className="hidden md:table-cell">Mitarbeiter</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={`department-${department.id}`}>
              <TableCell className="font-medium">
                {department.name}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ 
                    backgroundColor: `${department.color}20`, 
                    color: department.color 
                  }}>
                    {department.color}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {department.employees?.length || 0} Mitarbeiter
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(department)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(department)}>
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
