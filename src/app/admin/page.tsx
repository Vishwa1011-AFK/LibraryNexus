"use client"

import { useState, useEffect, useCallback } from "react";
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { type Book, type BooksApiResponse, type AdminStats } from "@/types";
import {
  BookOpen,
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
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    const fetchStats = useCallback(async () => {
        setIsLoadingStats(true);
        setErrorStats(null);
        try {
            const data = await apiClient<AdminStats>('/admin/stats');
            setStats(data);
        } catch (err: any) {
            setErrorStats(err.message || "Failed to load dashboard stats.");
            toast({ title: "Error Loading Stats", description: err.message, variant: "destructive" });
        } finally {
            setIsLoadingStats(false);
        }
    }, [toast]);

    const fetchBooks = useCallback(async () => {
        setIsLoadingBooks(true);
        setErrorBooks(null);
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '10'); 
        if (searchQuery) params.set('search', searchQuery);

        try {
            const data = await apiClient<BooksApiResponse>(`/books?${params.toString()}`); 
            setBooks(data.books || []);
            setTotalPages(data.totalPages || 1);
        } catch (err: any) {
            setErrorBooks(err.message || "Failed to load books.");
            toast({ title: "Error Loading Books", description: err.message, variant: "destructive" });
        } finally {
            setIsLoadingBooks(false);
        }
    }, [currentPage, searchQuery, toast]); 

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]); 


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
        toast({ title: "Action Needed", description: "Implement Add Book functionality." });
    };

    const handleEditBook = (bookId: string) => {
        router.push(`/admin/books/${bookId}?action=edit`); 
    };

    const handleDeleteBook = async (bookId: string, bookTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
             return;
        }
        try {
            setBooks(prev => prev.filter(b => b.id !== bookId));
            await apiClient(`/admin/books/${bookId}`, 'DELETE');
            toast({ title: "Success", description: `Book "${bookTitle}" deleted.` });
            fetchBooks(); 
        } catch (err: any) {
            toast({ title: "Error Deleting Book", description: err.message, variant: "destructive" });
            fetchBooks();
        }
    };

    const sidebarNavItems = [
        { name: "Books", href: "/admin", icon: BookOpen },
    ];
    const isActive = (path: string) => pathname === path;

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
                                    {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats?.totalBooks ?? 'N/A'}</div>}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Borrows</CardTitle>
                                    <BookUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats?.activeBorrows ?? 'N/A'}</div>}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                </CardHeader>
                                <CardContent>
                                     {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className={`text-2xl font-bold ${ (stats?.overdueBooks ?? 0) > 0 ? 'text-destructive' : ''}`}>{stats?.overdueBooks ?? 'N/A'}</div>}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                                    <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                     {isLoadingStats ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats?.newBooksMonthly ?? 'N/A'}</div>}
                                </CardContent>
                            </Card>
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
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                            </div>
                        </div>

                        <div className="rounded-md border">
                             {isLoadingBooks ? (
                                 <div className="space-y-1 p-4">
                                     <Skeleton className="h-16 w-full" />
                                     <Skeleton className="h-16 w-full" />
                                     <Skeleton className="h-16 w-full" />
                                     <Skeleton className="h-16 w-full" />
                                     <Skeleton className="h-16 w-full" />
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
                                                    <p className="text-xs text-muted-foreground">{book.availableCopies ?? 'N/A'} / {book.totalCopies ?? 'N/A'} copies</p>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{book.category || 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditBook(book.id)} aria-label="Edit Book">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book.id, book.title)} aria-label="Delete Book">
                                                        <Trash className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             ) : (
                                <p className="text-center text-muted-foreground py-10">No books found.</p>
                             )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}