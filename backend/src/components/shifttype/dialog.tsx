import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { PREDEFINED_COLORS } from '@/lib/colors'
import { ShiftType } from "@/types/api"

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_COLORS.length)
  return PREDEFINED_COLORS[randomIndex].value
}

interface ShiftTypeFormData {
  name: string
  description: string
  color: string
  is_active: boolean
}

interface ShiftTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ShiftTypeFormData) => void
  onDelete?: (shiftType: ShiftType) => void
  initialData?: ShiftType
}

export function ShiftTypeDialog({ isOpen, onClose, onSubmit, initialData }: ShiftTypeDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ShiftTypeFormData>({
    defaultValues: {
      name: '',
      description: '',
      color: getRandomColor(),
      is_active: true
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({
        name: '',
        description: '',
        color: getRandomColor(),
        is_active: true
      })
    }
  }, [initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: ShiftTypeFormData) => {
    const submitData = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim()
    }
    onSubmit(submitData)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Schichttyp bearbeiten' : 'Neuer Schichttyp'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Bearbeiten Sie die Daten des bestehenden Schichttyps.' 
              : 'Erfassen Sie die Daten des neuen Schichttyps.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              {...register('name', { 
                required: 'Name ist erforderlich',
                minLength: { value: 2, message: 'Name muss mindestens 2 Zeichen lang sein' }
              })} 
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Input 
              id="description" 
              {...register('description', { 
                required: 'Beschreibung ist erforderlich'
              })} 
            />
            {errors.description && (
              <span className="text-sm text-red-500">{errors.description.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Farbe</Label>
            <ColorPicker 
              value={initialData?.color || watch('color') || '#000000'}
              onChange={(color) => setValue('color', color)}
            />
            {!watch('color') && (
              <span className="text-sm text-red-500">Farbe ist erforderlich</span>
            )}
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
