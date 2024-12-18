import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users,
  Building2
} from "lucide-react"

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar>
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold" data-collapsed-text="SP">Schichtplaner</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/" onClick={handleLinkClick}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/employees" onClick={handleLinkClick}>
                <Users className="mr-2 h-4 w-4" />
                Mitarbeiter
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/departments" onClick={handleLinkClick}>
                <Building2 className="mr-2 h-4 w-4" />
                Abteilungen
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </Sidebar>
  )
}