import * as React from "react"
import { cn } from "@/lib/utils"
import { useContext } from "react"
import { SidebarContext } from "@/context/SidebarContext"
import { SidebarTrigger } from "./sidebar"

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export const Topbar = React.forwardRef<HTMLDivElement, TopbarProps>(
  ({ className, title, ...props }, ref) => {
    const {} = useContext(SidebarContext)

    return (
      <header
        ref={ref}
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border bg-background px-6",
          className
        )}
        {...props}
      >
        <SidebarTrigger />
                       
      </header>
    )
  }
)
Topbar.displayName = "Topbar"
