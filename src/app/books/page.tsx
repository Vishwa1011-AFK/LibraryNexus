"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SiteHeader } from "@/components/site-header"
import { BookGrid } from "@/components/book-grid"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type SortOptionKey = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'author_asc' | 'author_desc';
const sortOptions: { value: SortOptionKey; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
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
            const data = await apiClient<BooksApiResponse>(`/api/books?${queryString}`);
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
            const cats = await apiClient<string[]>('/api/categories');
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
        if (page >= 1 && page <= totalPages) {
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
           <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
                     {!isLoading && !error && <span className="text-sm font-normal text-muted-foreground">({totalBooksCount} items found)</span>}
                </div>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search books, authors, ISBN..." className="pl-10 border-input bg-background" value={searchQuery} onChange={handleSearchChange} />
                    </div>
                    <div className="flex gap-2">
                         <Select value={category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full sm:w-[180px] border-input bg-background"> <SelectValue placeholder="Category" /> </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={(value) => handleSortChange(value as SortOptionKey)}>
                            <SelectTrigger className="w-full sm:w-[150px] border-input bg-background"> <SelectValue placeholder="Sort by" /> </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

           {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <Skeleton className="aspect-[2/3] w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-destructive py-10">{error}</div>
            ) : books.length > 0 ? (
                <BookGrid books={books} isAdmin={false} className="mb-8" columns={{sm: 2, md: 4, lg: 6}} />
            ) : (
                <div className="text-center text-muted-foreground py-10">No books found matching your criteria.</div>
            )}


             {!isLoading && !error && totalPages > 1 && (
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
            )}
        </div>
      </main>
    </div>
  )
}