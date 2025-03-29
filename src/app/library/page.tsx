"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SiteHeader } from "@/components/site-header"
import { UserInfoHeader } from "@/components/user-info-header"
import { BookGrid } from "@/components/book-grid"
import { Input } from "@/components/ui/input" 
import { Search } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api"
import { type Book, type BooksApiResponse } from "@/types"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

type SortByType = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'author_asc' | 'author_desc';

export default function LibraryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [category, setCategory] = useState(searchParams.get('category') || "all");
    const [sortBy, setSortBy] = useState<SortByType>((searchParams.get('sortBy') as SortByType) || "newest");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<string[]>([]);
    const isAdmin = user?.isAdmin || false;

    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '10');
        if (searchQuery) params.set('search', searchQuery);
        if (category !== 'all') params.set('category', category);
        if (sortBy) params.set('sortBy', sortBy);
        return params.toString();
    }, [currentPage, searchQuery, category, sortBy]);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const queryString = buildQueryParams();
        try {
            const data = await apiClient<BooksApiResponse>(`/books?${queryString}`);
            setBooks(data.books || []);
            setTotalPages(data.totalPages || 1);
            if (data.page > data.totalPages && data.totalPages > 0) {
                setCurrentPage(data.totalPages);
            } else {
                setCurrentPage(data.page);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load books.");
            toast({ title: "Error", description: err.message || "Failed to load books.", variant: "destructive" });
            setBooks([]);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryParams, toast]);

    const fetchCategories = useCallback(async () => {
        try {
            const cats = await apiClient<string[]>('/categories');
            setCategories(cats || []);
        } catch (err) {
            toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
        }
    }, [toast]);

    useEffect(() => {
        fetchBooks();
        fetchCategories();
        const queryString = buildQueryParams();
        router.replace(`${pathname}?${queryString}`, { scroll: false });
    }, [fetchBooks, fetchCategories, buildQueryParams, router, pathname]);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/80">
            <SiteHeader />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {user && (
                        <UserInfoHeader name={`${user.firstName} ${user.lastName}`} email={user.email} isAdmin={isAdmin} />
                    )}
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                Library Books
                                {!isLoading && !error && (
                                    <span className="text-sm font-normal text-muted-foreground">({books.length} items on this page)</span>
                                )}
                            </h1>
                        </div>
                    </div>
                    {isLoading ? (
                        <Skeleton className="h-8 w-full" />
                    ) : error ? (
                        <div className="text-center text-destructive py-10">{error}</div>
                    ) : books.length > 0 ? (
                        <BookGrid books={books} isAdmin={isAdmin} className="mb-8" />
                    ) : (
                        <div className="text-center text-muted-foreground py-10">No books found matching your criteria.</div>
                    )}
                </div>
            </main>
        </div>
    )
}