import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Department } from "@/types/api"

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

interface DepartmentFormData {
  name: string
  color: string
  description: string
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
      color: getRandomColor(),
      description: ''
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({
        name: '',
        color: getRandomColor(),
        description: ''
      })
    }
  }, [initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: DepartmentFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            <Label htmlFor="description">Beschreibung</Label>
            <Input id="description" {...register('description')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Farbe</Label>
            <ColorPicker 
              value={initialData?.color || watch('color') || '#000000'}
              onChange={(color) => setValue('color', color)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
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