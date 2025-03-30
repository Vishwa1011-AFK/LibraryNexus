"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { type Book, type BooksApiResponse, type AdminStats } from "@/types";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  BookUp,
  Clock,
  AlertTriangle,
  CalendarPlus,
} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function AdminDashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [stats, setStats] = useState<AdminStats | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [errorStats, setErrorStats] = useState<string | null>(null);
    const [errorBooks, setErrorBooks] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooksCount, setTotalBooksCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '10');
        if (searchQuery) params.set('search', searchQuery);
        return params.toString();
    }, [currentPage, searchQuery]);

    const fetchStats = useCallback(async () => {
        setIsLoadingStats(true);
        setErrorStats(null);
        try {
            const data = await apiClient<AdminStats>('/api/admin/dashboard-stats');
            setStats(data);
        } catch (err: any) {
            setErrorStats(err.message || "Failed to load dashboard stats.");
            toast({ title: "Error Loading Stats", description: err.message, variant: "destructive" });
            setStats(null);
        } finally {
            setIsLoadingStats(false);
        }
    }, [toast]);

    const fetchBooks = useCallback(async () => {
        setIsLoadingBooks(true);
        setErrorBooks(null);
        const queryString = buildQueryParams();

        try {
            const data = await apiClient<BooksApiResponse>(`/api/admin/books?${queryString}`);
            setBooks(data.books || []);
            setTotalPages(data.totalPages || 1);
            setTotalBooksCount(data.total || 0);
            setCurrentPage(prevPage => Math.max(1, Math.min(prevPage, data.totalPages || 1)));
            router.replace(`${pathname}?${queryString}`, { scroll: false });
        } catch (err: any) {
            setErrorBooks(err.message || "Failed to load books.");
            toast({ title: "Error Loading Books", description: err.message, variant: "destructive" });
            setBooks([]);
            setTotalPages(1);
            setTotalBooksCount(0);
        } finally {
            setIsLoadingBooks(false);
        }
    }, [buildQueryParams, toast, router, pathname]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks, currentPage]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

     const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddBook = () => {
        router.push('/admin/books/new');
    };

    const handleEditBook = (bookId: string) => {
        router.push(`/admin/books/${bookId}?action=edit`);
    };

    const handleDeleteBook = async (bookId: string, bookTitle: string) => {
        try {
            await apiClient(`/api/admin/books/${bookId}`, 'DELETE');
            toast({ title: "Success", description: `Book "${bookTitle}" deleted.` });
            fetchBooks();
            fetchStats();
        } catch (err: any) {
            toast({ title: "Error Deleting Book", description: err.message, variant: "destructive" });
        }
    };

     const renderPaginationItems = () => {
         const items = [];
         const maxPagesToShow = 5;
         const halfMaxPages = Math.floor(maxPagesToShow / 2);
         let startPage = Math.max(1, currentPage - halfMaxPages);
         let endPage = Math.min(totalPages, currentPage + halfMaxPages);

         if (totalPages <= maxPagesToShow) {
             startPage = 1;
             endPage = totalPages;
         } else if (currentPage <= halfMaxPages) {
             endPage = maxPagesToShow;
         } else if (currentPage + halfMaxPages >= totalPages) {
             startPage = totalPages - maxPagesToShow + 1;
         }

         if (startPage > 1) {
             items.push(
                 <PaginationItem key={1}>
                     <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink>
                 </PaginationItem>
             );
             if (startPage > 2) {
                 items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
             }
         }

         for (let i = startPage; i <= endPage; i++) {
             items.push(
                 <PaginationItem key={i}>
                     <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
                         {i}
                     </PaginationLink>
                 </PaginationItem>
             );
         }

         if (endPage < totalPages) {
             if (endPage < totalPages - 1) {
                 items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
             }
             items.push(
                 <PaginationItem key={totalPages}>
                     <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
                         {totalPages}
                     </PaginationLink>
                 </PaginationItem>
             );
         }
         return items;
     };

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1 flex">
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Books Management</h1>
                                <p className="text-muted-foreground">Manage your library's book collection</p>
                            </div>
                            <Button onClick={handleAddBook} className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Book
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats?.totalBooks ?? '...'}</div>}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Borrows</CardTitle>
                                    <BookUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats?.activeBorrows ?? '...'}</div>}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                </CardHeader>
                                <CardContent>
                                     {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className={`text-2xl font-bold ${ (stats?.overdue ?? 0) > 0 ? 'text-destructive' : ''}`}>{stats?.overdue ?? '...'}</div>}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                                    <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                     {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats?.newThisMonth ?? '...'}</div>}
                                </CardContent>
                            </Card>
                            {errorStats && <p className="text-destructive col-span-full text-center">{errorStats}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search books by title, author, ISBN..."
                                    className="w-full bg-background pl-8 rounded-md"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={(e) => { if (e.key === 'Enter') fetchBooks(); }}
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                            </div>
                        </div>

                        <div className="rounded-md border">
                             {isLoadingBooks ? (
                                 <div className="space-y-1 p-4">
                                     {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full" />
                                     ))}
                                 </div>
                             ) : errorBooks ? (
                                <p className="text-center text-destructive py-10">{errorBooks}</p>
                             ) : books.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px] hidden sm:table-cell"></TableHead>
                                            <TableHead>Book Details</TableHead>
                                            <TableHead>Availability</TableHead>
                                            <TableHead className="hidden md:table-cell">Category</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {books.map((book) => (
                                            <TableRow key={book.id}>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Link href={`/admin/books/${book.id}`}>
                                                        <Image
                                                            src={book.coverUrl || book.cover || "/placeholder.svg"}
                                                            alt={book.title}
                                                            width={40}
                                                            height={60}
                                                            className="rounded-sm object-cover aspect-[2/3]"
                                                        />
                                                     </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/admin/books/${book.id}`} className="font-medium hover:underline">
                                                        {book.title}
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                                    <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={book.available ? "success" : "destructive"} className="text-xs">
                                                        {book.available ? "Available" : "Unavailable"}
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground">{book.availableCopies ?? '?'} / {book.totalCopies ?? '?'} copies</p>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{book.category || 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditBook(book.id)} aria-label="Edit Book">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" aria-label="Delete Book">
                                                                <Trash className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the book
                                                                    "{book.title}" and all associated loan/wishlist data.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteBook(book.id, book.title)}
                                                                    className={buttonVariants({ variant: "destructive" })}
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             ) : (
                                <p className="text-center text-muted-foreground py-10">
                                    {searchQuery ? `No books found matching "${searchQuery}".` : "No books in the library yet."}
                                </p>
                             )}
                        </div>

                         {!isLoadingBooks && !errorBooks && totalPages > 1 && (
                            <div className="mt-6 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                aria-disabled={currentPage <= 1}
                                                className={cn("cursor-pointer", currentPage <= 1 && "pointer-events-none opacity-50")}
                                            />
                                        </PaginationItem>
                                        {renderPaginationItems()}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                aria-disabled={currentPage >= totalPages}
                                                className={cn("cursor-pointer", currentPage >= totalPages && "pointer-events-none opacity-50")}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

import { cva } from "class-variance-authority";
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
    defaultVariants: {  }
  }
);