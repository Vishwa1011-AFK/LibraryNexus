"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Trash2, Search, BookOpen, Heart } from "lucide-react"
import { UserInfoHeader } from "@/components/user-info-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { apiClient } from "@/lib/api"
import { type WishlistItem, type WishlistApiResponse } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from 'date-fns';

export default function WishlistPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);
    const [errorWishlist, setErrorWishlist] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) {
                setIsLoadingWishlist(false);
                return;
            }

            setIsLoadingWishlist(true);
            setErrorWishlist(null);
            apiClient<WishlistApiResponse>('/users/wishlist/me')
                .then(data => setWishlistItems(data.books || []))
                .catch(err => {
                    console.error("Failed to fetch wishlist:", err);
                    setErrorWishlist(err.message || "Failed to load wishlist.");
                    toast({ title: "Error Loading Wishlist", description: err.message || "Could not load wishlist.", variant: "destructive" });
                })
                .finally(() => setIsLoadingWishlist(false));
        };

        if (!authLoading && user) {
            fetchWishlist();
        } else if (!authLoading && !user) {
            setIsLoadingWishlist(false);
            setWishlistItems([]);
        }
    }, [user, authLoading, toast]);

    const filteredWishlist = useMemo(() => {
        if (!searchQuery) return wishlistItems;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return wishlistItems.filter(item =>
            item.title?.toLowerCase().includes(lowerCaseQuery) ||
            item.author?.toLowerCase().includes(lowerCaseQuery) ||
            item.isbn?.includes(lowerCaseQuery)
        );
    }, [wishlistItems, searchQuery]);

    const handleRemoveFromWishlist = async (bookId: string, bookTitle: string) => {
        if (!user) return;

        const originalWishlist = [...wishlistItems];
        setWishlistItems(prev => prev.filter(item => item.id !== bookId));

        try {
            await apiClient(`/users/wishlist/me/${bookId}`, 'DELETE');
            toast({ title: "Success", description: `${bookTitle} removed from wishlist.` });
        } catch (err: any) {
            console.error("Failed to remove from wishlist:", err);
            toast({ title: "Error", description: err.message || `Failed to remove ${bookTitle}.`, variant: "destructive" });
            setWishlistItems(originalWishlist); // Revert on error
        }
    };

    const formatDate = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return 'N/A';
        try {
            return format(new Date(dateInput), 'PP'); // 'MMM d, yyyy'
        } catch {
            return 'Invalid Date';
        }
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">Loading User Data...</main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">Please log in to view your wishlist.</main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <UserInfoHeader name={`${user.firstName} ${user.lastName}`} email={user.email} isAdmin={user.isAdmin} />

                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                             <h1 className="text-3xl font-bold flex items-center gap-2 mb-2 md:mb-0">
                                <Heart className="h-6 w-6 text-primary"/> My Wishlist
                                {!isLoadingWishlist && <span className="text-lg font-normal text-muted-foreground">({filteredWishlist.length})</span>}
                             </h1>
                            <div className="relative w-full md:w-1/3">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search wishlist..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            {isLoadingWishlist ? (
                                <div className="space-y-2 p-4">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                             ) : errorWishlist ? (
                                 <p className="text-center text-destructive py-10">{errorWishlist}</p>
                             ) : filteredWishlist.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px] hidden sm:table-cell"></TableHead>
                                            <TableHead>Book Details</TableHead>
                                            <TableHead className="hidden md:table-cell">Category</TableHead>
                                            <TableHead className="hidden lg:table-cell">Added On</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredWishlist.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Link href={`/books/${item.id}`}>
                                                         <Image
                                                             src={item.coverUrl || "/placeholder.svg"}
                                                             alt={item.title}
                                                             width={50}
                                                             height={75}
                                                             className="rounded-sm object-cover aspect-[2/3]"
                                                         />
                                                     </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/books/${item.id}`} className="font-medium hover:underline">
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground">{item.author}</p>
                                                    <p className="text-xs text-muted-foreground md:hidden">{item.category || 'N/A'}</p>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{item.category || 'N/A'}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{formatDate(item.addedAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveFromWishlist(item.id, item.title)}
                                                        aria-label="Remove from wishlist"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-center text-muted-foreground py-10">
                                    {searchQuery ? 'No items match your search.' : 'Your wishlist is empty.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}