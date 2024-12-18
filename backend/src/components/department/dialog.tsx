import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Department } from "@/types/api"
import { PREDEFINED_COLORS } from '@/lib/colors'

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_COLORS.length)
  return PREDEFINED_COLORS[randomIndex].value
}

interface DepartmentFormData {
  id?: number
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
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<DepartmentFormData>({
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
    const submitData = {
      ...data,
      name: data.name.trim(),
      description: data.description || ''
    }
    onSubmit(submitData)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Abteilung bearbeiten' : 'Neue Abteilung'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Bearbeiten Sie die Daten der bestehenden Abteilung.' 
              : 'Erfassen Sie die Daten der neuen Abteilung.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              {...register('name', { 
                required: 'Name ist erforderlich',
                minLength: { value: 2, message: 'Name muss mindestens 2 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Name darf maximal 50 Zeichen lang sein' }
              })} 
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message}</span>
            )}
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
