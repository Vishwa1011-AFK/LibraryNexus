"use client"

import { useState, useEffect } from "react";
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
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
  Filter,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { type Book, type BooksApiResponse } from "@/types";

interface AdminStats {
    totalBooks: number;
    activeBorrows: number;
    overdue: number;
    newThisMonth: number;
}

interface AdminBook extends Book {
    totalCopies?: number;
    availableCopies?: number;
    status?: "Available" | "Unavailable" | string;
    added?: string;
    borrows?: number;
}

interface AdminBooksApiResponse extends BooksApiResponse {
    books: AdminBook[];
}


export default function AdminDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [books, setBooks] = useState<AdminBook[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoadingStats(true);
            try {
                const data = await apiClient<AdminStats>('/admin/dashboard-stats');
                setStats(data);
            } catch (error: any) {
                toast({ title: "Error Loading Stats", description: error.message || "Could not load dashboard statistics.", variant: "destructive" });
            } finally {
                setIsLoadingStats(false);
            }
        };

        const fetchBooks = async () => {
            setIsLoadingBooks(true);
            const queryParams = new URLSearchParams();
             if (searchTerm) queryParams.set('search', searchTerm);
            try {
                const data = await apiClient<AdminBooksApiResponse>(`/admin/books?${queryParams.toString()}`);
                setBooks(data.books || []);
            } catch (error: any) {
                toast({ title: "Error Loading Books", description: error.message || "Could not load book list.", variant: "destructive" });
            } finally {
                setIsLoadingBooks(false);
            }
        };

        fetchStats();
        fetchBooks();
    }, [toast, searchTerm]);

     const handleDeleteBook = async (bookId: string, bookTitle: string) => {
         if (!confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
             return;
         }
         try {
             await apiClient(`/admin/books/${bookId}`, 'DELETE');
             toast({ title: "Success", description: `Book "${bookTitle}" deleted successfully.` });
             setBooks(prev => prev.filter(b => b.id !== bookId));
         } catch (error: any) {
             toast({ title: "Deletion Failed", description: error.message || "Could not delete book.", variant: "destructive" });
         }
     };


    return (
         <ProtectedRoute adminOnly={true}>
             <div className="flex min-h-screen flex-col">
                 <SiteHeader />
                 <div className="flex flex-1">
                    <aside className="w-64 border-r border-border hidden md:block">
                         <div className="p-4">
                             <h2 className="font-semibold mb-4">Admin Panel</h2>
                             <nav className="space-y-1">
                                <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-foreground">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Books</span>
                                </Link>
                             </nav>
                         </div>
                     </aside>

                     <main className="flex-1 p-4 md:p-6 overflow-x-auto">
                         <div className="max-w-7xl mx-auto">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                 <div>
                                     <h1 className="text-3xl font-bold mb-2">Books Management</h1>
                                     <p className="text-muted-foreground">Manage your library's book collection</p>
                                 </div>
                                 <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                     <Plus className="h-4 w-4 mr-2" />
                                     Add New Book
                                 </Button>
                             </div>

                             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                                {isLoadingStats || !stats ? (
                                    <>
                                        <Card className="bg-muted"><CardHeader><Skeleton className="h-6 w-2/3 mb-2" /><Skeleton className="h-8 w-1/2" /></CardHeader></Card>
                                        <Card className="bg-muted"><CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-8 w-1/3" /></CardHeader></Card>
                                        <Card className="bg-muted"><CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-8 w-1/4" /></CardHeader></Card>
                                        <Card className="bg-muted"><CardHeader><Skeleton className="h-6 w-4/5 mb-2" /><Skeleton className="h-8 w-1/3" /></CardHeader></Card>
                                    </>
                                ) : (
                                    <>
                                         <Card className="bg-muted">
                                             <CardHeader className="pb-2"> <CardTitle className="text-lg">Total Books</CardTitle> </CardHeader>
                                             <CardContent> <div className="text-3xl font-bold">{stats.totalBooks}</div> </CardContent>
                                         </Card>
                                         <Card className="bg-muted">
                                            <CardHeader className="pb-2"> <CardTitle className="text-lg">Active Borrows</CardTitle> </CardHeader>
                                             <CardContent> <div className="text-3xl font-bold">{stats.activeBorrows}</div> </CardContent>
                                         </Card>
                                         <Card className="bg-muted">
                                             <CardHeader className="pb-2"> <CardTitle className="text-lg">Overdue</CardTitle> </CardHeader>
                                             <CardContent> <div className={`text-3xl font-bold ${stats.overdue > 0 ? 'text-destructive' : ''}`}>{stats.overdue}</div> </CardContent>
                                         </Card>
                                         <Card className="bg-muted">
                                             <CardHeader className="pb-2"> <CardTitle className="text-lg">New This Month</CardTitle> </CardHeader>
                                             <CardContent> <div className="text-3xl font-bold">{stats.newThisMonth}</div> </CardContent>
                                         </Card>
                                    </>
                                )}
                            </div>

                             <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                 <div className="relative w-full md:max-w-sm">
                                     <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                     <Input type="search" placeholder="Search books by title, author, ISBN..." className="w-full bg-muted pl-8 rounded-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                 </div>
                                 <div className="flex gap-2 w-full md:w-auto">
                                     <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                                         <Filter className="h-4 w-4 mr-2" /> Filter
                                     </Button>
                                     <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                                         <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
                                     </Button>
                                 </div>
                             </div>

                             <div className="rounded-md border bg-card">
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Cover</TableHead>
                                            <TableHead>Title / Author</TableHead>
                                            <TableHead>ISBN</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-center">Stock</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingBooks ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={`skel-${i}`}>
                                                    <TableCell><Skeleton className="h-[75px] w-[50px] rounded-sm" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-3/4 mb-1" /><Skeleton className="h-3 w-1/2" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : books.length === 0 ? (
                                             <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24">No books found.</TableCell>
                                            </TableRow>
                                        ) : (
                                            books.map((book) => (
                                                <TableRow key={book.id}>
                                                     <TableCell>
                                                         <Image
                                                            src={book.coverUrl || book.cover || "/placeholder.svg"}
                                                            alt={book.title}
                                                            width={50}
                                                            height={75}
                                                            className="rounded-sm object-cover aspect-[2/3]"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/admin/books/${book.id}`} className="font-medium hover:underline">{book.title}</Link>
                                                        <p className="text-sm text-muted-foreground">{book.author}</p>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{book.isbn}</TableCell>
                                                    <TableCell>
                                                         {book.category && <Badge variant="secondary" className="whitespace-nowrap">{book.category}</Badge>}
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm">
                                                         {book.availableCopies ?? 'N/A'} / {book.totalCopies ?? 'N/A'}
                                                    </TableCell>
                                                     <TableCell className="text-center">
                                                        {book.status && (
                                                            <Badge
                                                                variant={book.status === "Available" ? "success" : "destructive"}
                                                                className="text-xs"
                                                             >
                                                                 {book.status}
                                                             </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem asChild><Link href={`/admin/books/${book.id}/edit`}><Edit className="mr-2 h-4 w-4"/> Edit</Link></DropdownMenuItem>
                                                                <DropdownMenuItem asChild><Link href={`/admin/issue?bookId=${book.id}`}><BookOpen className="mr-2 h-4 w-4"/> Issue</Link></DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeleteBook(book.id, book.title)}>
                                                                    <Trash className="mr-2 h-4 w-4"/> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                 </Table>
                             </div>
                         </div>
                     </main>
                 </div>
             </div>
         </ProtectedRoute>
    )
}