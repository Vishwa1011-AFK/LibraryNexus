"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"

export function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  const basePath = isAdmin ? "/admin" : ""

  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  return (
    <header className="border-b border-border/40 bg-background">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
            <span className="font-bold text-xl">Nexus</span>
          </Link>
        </div>
        <nav className="flex-1 flex items-center space-x-4 lg:space-x-6">
          <Link
            href={`${basePath}/`}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === basePath || pathname === `${basePath}/` ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href={`${basePath}/books`}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname?.startsWith(`${basePath}/books`) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Books
          </Link>
          <Link
            href={`${basePath}/transactions`}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname?.startsWith(`${basePath}/transactions`) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isAdmin ? "Transactions" : "My Books"}
          </Link>
          {isAdmin && (
            <Link
              href="/admin/users"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname?.startsWith("/admin/users") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Users
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-full max-w-sm lg:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[200px] lg:w-[250px]"
            />
          </div>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

