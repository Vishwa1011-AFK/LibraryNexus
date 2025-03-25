"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, BookOpen, User, LogOut, BookMarked, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  isLoggedIn?: boolean
}

export function SiteHeader({ isLoggedIn = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const navItems = [
    { name: "Library", href: "/library", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Books", href: "/books", icon: <BookMarked className="h-5 w-5" /> },
    { name: "Wishlist", href: "/wishlist", icon: <Heart className="h-5 w-5" /> },
    { name: "Account", href: "/account", icon: <User className="h-5 w-5" /> },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-md">
              <Image
                src="/nexus-logo.svg"
                alt="Nexus Library"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden font-bold sm:inline-block">Nexus Library</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {isLoggedIn && !isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {isMobile && (
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                    <div className="flex flex-col gap-6 py-4">
                      <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <Image
                          src="/nexus-logo.svg"
                          alt="Nexus Library"
                          width={32}
                          height={32}
                          className="rounded-md"
                        />
                        <span className="font-bold">Nexus Library</span>
                      </Link>
                      <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                              isActive(item.href) ? "text-primary" : "text-muted-foreground",
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        ))}
                        <Link
                          href="/signin"
                          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LogOut className="h-5 w-5" />
                          Sign Out
                        </Link>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <Link href="/signin" className="hidden md:block">
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}