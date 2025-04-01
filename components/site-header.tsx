"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut, Heart, Compass, Search as SearchIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const baseNavItems = [
        { name: "Explore", href: "/library", icon: <Compass className="h-5 w-5" /> },
        { name: "Search Catalog", href: "/books", icon: <SearchIcon className="h-5 w-5" /> },
        { name: "Wishlist", href: "/wishlist", icon: <Heart className="h-5 w-5" /> },
        { name: "Account", href: "/account", icon: <User className="h-5 w-5" /> },
    ];

    const adminNavItem = { name: "Admin", href: "/admin", icon: <Shield className="h-5 w-5" /> };

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        await logout();
        setIsMenuOpen(false);
    };

    return (
        // Increased header height slightly
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Increased header height */}
            <div className="container flex h-20 items-center justify-between">
                {/* Increased gap */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                         {/* Increased logo container size */}
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                             {/* Increased logo image size */}
                            <Image src="/nexus-logo.svg" alt="Nexus Library Logo" width={42} height={42} className="object-contain" priority />
                        </div>
                        {/* Increased text size */}
                        <span className="hidden font-display text-2xl font-weight: 700 tracking-wide sm:inline-block">
                            Library Nexus
                        </span>
                    </Link>
                </div>

                {isLoggedIn && !isMobile && (
                     // Adjusted gap for nav items if needed, keeping as is for now
                    <nav className="hidden md:flex items-center gap-6">
                        {baseNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user?.isAdmin && (
                            <Link
                                key={adminNavItem.href}
                                href={adminNavItem.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                    isActive(adminNavItem.href) ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {adminNavItem.name}
                            </Link>
                        )}
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
                                            <Link href="/" className="flex items-center gap-2 px-2" onClick={() => setIsMenuOpen(false)}>
                                                 {/* Increased logo size in mobile sheet */}
                                                <Image src="/nexus-logo.svg" alt="Nexus Library Logo" width={40} height={40} className="rounded-md" />
                                                 {/* Adjusted size in mobile sheet */}
                                                <span className="font-display text-xl tracking-wide">
                                                    Library Nexus
                                                </span>
                                            </Link>
                                            <nav className="flex flex-col gap-4 px-2">
                                                {baseNavItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                                            isActive(item.href) ? "text-primary" : "text-muted-foreground"
                                                        )}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {item.icon}
                                                        {item.name}
                                                    </Link>
                                                ))}
                                                {user?.isAdmin && (
                                                     <Link
                                                        key={adminNavItem.href}
                                                        href={adminNavItem.href}
                                                        className={cn(
                                                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                                            isActive(adminNavItem.href) ? "text-primary" : "text-muted-foreground"
                                                        )}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {adminNavItem.icon}
                                                        {adminNavItem.name}
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-left w-full pt-4 border-t mt-2"
                                                    aria-label="Sign Out"
                                                >
                                                    <LogOut className="h-5 w-5" />
                                                    Sign Out
                                                </button>
                                            </nav>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            )}
                            <Button variant="outline" size="sm" className="hidden md:block" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" passHref>
                                <Button variant="outline" size="sm" className="hidden sm:flex">Sign In</Button>
                            </Link>
                            <Link href="/signup" passHref>
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}