"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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

export function BooksClientContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooksCount, setTotalBooksCount] = useState(0);

    const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || "");
    const [category, setCategory] = useState(() => searchParams.get('category') || "all");
    const [sortBy, setSortBy] = useState<SortOptionKey>(() => (searchParams.get('sortBy') as SortOptionKey) || "newest");
    const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page') || 1));
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

    const fetchBooks = useCallback(async (initialPageLoad = false) => {
        setIsLoading(true);
        setError(null);
        const queryString = buildQueryParams();

        try {
            const data = await apiClient<BooksApiResponse>(`/books?${queryString}`);
            setBooks(data.books || []);
            const fetchedTotalPages = data.totalPages || 1;
            setTotalPages(fetchedTotalPages);
            setTotalBooksCount(data.total || 0);

            if (!initialPageLoad) {
                 const correctedPage = Math.max(1, Math.min(currentPage, fetchedTotalPages));
                 if (correctedPage !== currentPage) {
                      setCurrentPage(correctedPage);
                 }
            } else {
                 setCurrentPage(Number(searchParams.get('page') || 1));
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
    }, [buildQueryParams, toast, currentPage, searchParams]);

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
         fetchBooks(true);
         fetchCategories();
     }, [fetchCategories]);

      useEffect(() => {
          const initialQueryString = buildQueryParams();
          fetchBooks(false);
      }, [searchQuery, category, sortBy, currentPage]);

     useEffect(() => {
         const queryString = buildQueryParams();
         if (searchParams.toString() !== queryString) {
              router.push(`${pathname}?${queryString}`, { scroll: false });
         }
     }, [searchQuery, category, sortBy, currentPage, buildQueryParams, router, pathname, searchParams]);

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

    const renderPaginationItems = () => {
        const items = [];
        const maxPagesToShow = 5;
        const halfMaxPages = Math.floor(maxPagesToShow / 2);
        let startPage = Math.max(1, currentPage - halfMaxPages);
        let endPage = Math.min(totalPages, currentPage + halfMaxPages);

        if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; }
        else if (currentPage <= halfMaxPages) { endPage = maxPagesToShow; }
        else if (currentPage + halfMaxPages >= totalPages) { startPage = totalPages - maxPagesToShow + 1; }

        if (startPage > 1) {
            items.push(<PaginationItem key={1}><PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink></PaginationItem>);
            if (startPage > 2) { items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>); }
        }
        for (let i = startPage; i <= endPage; i++) { items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>{i}</PaginationLink></PaginationItem>);}
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) { items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>); }
            items.push(<PaginationItem key={totalPages}><PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink></PaginationItem>);
        }
        return items;
    };

    return (
        <>
             <h1 className="text-3xl font-bold mb-4">Search Catalog</h1>
             <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                        placeholder="Search books, authors, ISBN..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>
                 <div className="flex gap-4 w-full md:w-auto">
                     <Select value={category} onValueChange={handleCategoryChange}>
                         <SelectTrigger className="w-full md:w-[180px]">
                             <SelectValue placeholder="Category" />
                         </SelectTrigger>
                         <SelectContent>
                             <SelectItem value="all">All Categories</SelectItem>
                             {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                         </SelectContent>
                     </Select>
                     <Select value={sortBy} onValueChange={(v) => handleSortChange(v as SortOptionKey)}>
                         <SelectTrigger className="w-full md:w-[180px]">
                             <SelectValue placeholder="Sort by" />
                         </SelectTrigger>
                         <SelectContent>
                             {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                         </SelectContent>
                     </Select>
                 </div>
             </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                         <div key={index} className="space-y-2">
                             <Skeleton className="aspect-[2/3] w-full rounded-md" />
                             <Skeleton className="h-4 w-3/4" />
                             <Skeleton className="h-4 w-1/2" />
                         </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-10 text-destructive">{error}</div>
            ) : books.length > 0 ? (
                <BookGrid books={books} isAdmin={false} columns={{sm: 2, md: 3, lg: 4}} />
            ) : (
                 <p className="text-center py-10 text-muted-foreground">No books found matching your criteria.</p>
             )}

            {!isLoading && !error && totalPages > 1 && (
                 <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} aria-disabled={currentPage <= 1} className={cn("cursor-pointer", currentPage <= 1 && "pointer-events-none opacity-50")} />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} aria-disabled={currentPage >= totalPages} className={cn("cursor-pointer", currentPage >= totalPages && "pointer-events-none opacity-50")} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}