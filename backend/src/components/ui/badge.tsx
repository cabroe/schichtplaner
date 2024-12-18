interface BadgeProps {
  label: string
  color: string
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span 
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" 
      style={{ 
        backgroundColor: `${color}20`, 
        color: color 
      }}
    >
      {label}
    </span>
  )
}
