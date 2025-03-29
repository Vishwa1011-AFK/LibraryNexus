"use client"

import { useState, useEffect, useMemo } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Trash2, Search, BookOpen, Heart } from "lucide-react"
import { UserInfoHeader } from "@/components/user-info-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { apiClient } from "@/lib/api"
import { type BorrowedBook, type WishlistItem, type WishlistApiResponse } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from 'date-fns';

export default function WishlistPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoadingBorrowed, setIsLoadingBorrowed] = useState(true);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);
    const [errorBorrowed, setErrorBorrowed] = useState<string | null>(null);
    const [errorWishlist, setErrorWishlist] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setIsLoadingBorrowed(false);
                setIsLoadingWishlist(false);
                return;
            }

            setIsLoadingBorrowed(true);
            setErrorBorrowed(null);
            apiClient<BorrowedBook[]>('/users/me/borrowed-books')
                .then(data => setBorrowedBooks(data || []))
                .catch(err => {
                    console.error("Failed to fetch borrowed books:", err);
                    setErrorBorrowed(err.message || "Failed to load borrowed books.");
                    toast({ title: "Error Loading Borrowed Books", description: err.message || "Could not load borrowed books.", variant: "destructive" });
                })
                .finally(() => setIsLoadingBorrowed(false));

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
            fetchData();
        } else if (!authLoading && !user) {
            setIsLoadingBorrowed(false);
            setIsLoadingWishlist(false);
            setBorrowedBooks([]);
            setWishlistItems([]);
        }
    }, [user, authLoading, toast]);

    const filteredBorrowedBooks = useMemo(() => {
        if (!searchQuery) return borrowedBooks;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return borrowedBooks.filter(item =>
            item.book?.title?.toLowerCase().includes(lowerCaseQuery) ||
            item.book?.isbn?.includes(lowerCaseQuery)
        );
    }, [borrowedBooks, searchQuery]);

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
            setWishlistItems(originalWishlist);
        }
    };

    const formatDate = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return 'N/A';
        try {
            return format(new Date(dateInput), 'PP');
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
                <main className="flex-1 flex items-center justify-center">Please log in to view your wishlist and borrowed books.</main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/80">
            <SiteHeader />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <UserInfoHeader name={`${user.firstName} ${user.lastName}`} email={user.email} isAdmin={user.isAdmin} />
                </div>
            </main>
        </div>
    )
}
