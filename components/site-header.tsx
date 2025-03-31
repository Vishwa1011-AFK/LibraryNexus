"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut, Heart, Compass, Search as SearchIcon } from "lucide-react";
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

    const navItems = [
        { name: "Explore", href: "/library", icon: <Compass className="h-5 w-5" /> },
        { name: "Search Catalog", href: "/books", icon: <SearchIcon className="h-5 w-5" /> },
        { name: "Wishlist", href: "/wishlist", icon: <Heart className="h-5 w-5" /> },
        { name: "Account", href: "/account", icon: <User className="h-5 w-5" /> },
    ];

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        await logout();
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                            <Image src="/nexus-logo.svg" alt="Nexus Library" width={32} height={32} className="object-contain" priority />
                        </div>
                        <span className="hidden font-bold sm:inline-block">Nexus Library</span>
                    </Link>
                </div>

                {isLoggedIn && !isMobile && (
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
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
                    </nav>
                )}

                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <>
                            {/* Mobile Menu */}
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
                                                <Image src="/nexus-logo.svg" alt="Nexus Library" width={32} height={32} className="rounded-md" />
                                                <span className="font-bold">Nexus Library</span>
                                            </Link>
                                            <nav className="flex flex-col gap-4 px-2">
                                                {navItems.map((item) => (
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
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-left w-full"
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