"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { BookGrid } from "@/components/book-grid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import { type Book, type BooksApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type SortOptionKey = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'author_asc' | 'author_desc';
const sortOptions: { value: SortOptionKey; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'author_asc', label: 'Author (A-Z)' },
    { value: 'author_desc', label: 'Author (Z-A)' },
];

export default function BooksPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooksCount, setTotalBooksCount] = useState(0);

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [category, setCategory] = useState(searchParams.get('category') || "all");
    const [sortBy, setSortBy] = useState<SortOptionKey>((searchParams.get('sortBy') as SortOptionKey) || "newest");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));
    const [categories, setCategories] = useState<string[]>([]);

    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '12');
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
            setTotalBooksCount(data.total || 0);

            const correctedPage = Math.max(1, Math.min(currentPage, data.totalPages || 1));
            if (correctedPage !== currentPage) {
                 setCurrentPage(correctedPage);
            }

        } catch (err: any) {
            console.error("Failed to fetch books:", err);
            setError(err.message || "Failed to load books.");
            toast({ title: "Error", description: err.message || "Failed to load books.", variant: "destructive" });
            setBooks([]);
            setTotalPages(1);
            setTotalBooksCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryParams, toast, currentPage]);

    const fetchCategories = useCallback(async () => {
        try {
            const cats = await apiClient<string[]>('/categories');
            setCategories(cats || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
        }
    }, [toast]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const queryString = buildQueryParams();
        if (`?${queryString}` !== window.location.search) {
            router.replace(`${pathname}?${queryString}`, { scroll: false });
        }
    }, [searchQuery, category, sortBy, currentPage, buildQueryParams, router, pathname]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setCurrentPage(1);
    };
    const handleSortChange = (value: SortOptionKey) => {
        setSortBy(value);
        setCurrentPage(1);
    };
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 p-4 md:p-6">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Search Catalog</h1>
                    <Input placeholder="Search books, authors, ISBN..." value={searchQuery} onChange={handleSearchChange} />
                    {isLoading ? <Skeleton /> : error ? <div>{error}</div> : <BookGrid books={books} isAdmin={false} />}
                    {!isLoading && !error && totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </main>
        </div>
    );
}
