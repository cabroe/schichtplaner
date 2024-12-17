import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Department } from "@/types/api"

interface DepartmentFormData {
  name: string
  color: string
}

interface DepartmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DepartmentFormData) => void
  initialData?: Department
}

export function DepartmentDialog({ isOpen, onClose, onSubmit, initialData }: DepartmentDialogProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<DepartmentFormData>({
    defaultValues: {
      name: '',
      color: '#000000'
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({
        name: '',
        color: '#000000'
      })
    }
  }, [initialData, reset])

  const handleFormSubmit = (data: DepartmentFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Abteilung bearbeiten' : 'Neue Abteilung'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Farbe</Label>
            <ColorPicker 
              value={watch('color')}
              onChange={(color) => setValue('color', color)}
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
