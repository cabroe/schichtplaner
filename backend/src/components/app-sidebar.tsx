import { Sidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold" data-collapsed-text="SP">Schichtplaner</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Schichten
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Mitarbeiter
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              Einstellungen
            </Button>
          </li>
        </ul>
      </nav>
    </Sidebar>
  )
}
