"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"

export function SiteHeader({ isLoggedIn }: { isLoggedIn?: boolean }) {

  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="w-full py-4 bg-background">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-primary font-bold text-2xl">
          Nexus
        </Link>

        <div className="relative w-full max-w-md mx-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search Books"
              className="w-full bg-muted/50 border-muted pl-3 pr-10 py-2 rounded-md"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link
                href="/account"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/account") ? "text-primary underline" : "text-muted-foreground"
                }`}
              >
                My account
              </Link>
              <Link
                href="/library"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/library" ? "text-primary underline" : "text-muted-foreground"
                }`}
              >
                Library
              </Link>
              <Link
                href="/wishlist"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/wishlist" ? "text-primary underline" : "text-muted-foreground"
                }`}
              >
                Wishlist
              </Link>
              <button onClick={logout} className="text-sm font-medium text-muted-foreground hover:text-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/signin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/signup" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

