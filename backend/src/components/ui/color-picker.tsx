import { useState } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
}

export function ColorPicker({ value = '#000000', onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange?.(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          className="w-full justify-start"
          style={{ backgroundColor: color }}
        >
          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: color }} />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <HexColorPicker color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
