import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColorPicker } from "@/components/ui/color-picker"
import { Department } from "@/types/api"

interface EmployeeFormData {
  id?: number
  first_name: string
  last_name: string
  email: string
  department_id: number
  color: string
  password?: string
  is_admin: boolean
}

interface EmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => void
  initialData?: EmployeeFormData
  departments: Department[]
}

export function EmployeeDialog({ isOpen, onClose, onSubmit, initialData, departments }: EmployeeDialogProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<EmployeeFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      department_id: 0,
      color: '#000000',
      is_admin: false
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        department_id: 0,
        color: '#000000',
        is_admin: false
      })
    }
  }, [initialData, reset])

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname</Label>
              <Input id="first_name" {...register('first_name')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname</Label>
              <Input id="last_name" {...register('last_name')} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" type="email" {...register('email')} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Abteilung</Label>
            <Select 
              onValueChange={(value) => setValue('department_id', parseInt(value))}
              value={watch('department_id').toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Abteilung wählen" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Farbe</Label>
            <ColorPicker 
              value={watch('color')}
              onChange={(color) => setValue('color', color)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password')}
              required={!initialData} 
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit">
              Speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
