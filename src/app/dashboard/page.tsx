"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowUpRight, Library, CheckCircle, Heart } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { type BorrowedBook, type ReadingHistoryItem, type ReadingHistoryApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from 'date-fns';
import Link from "next/link";

export default function Dashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>([]);
    const [isLoadingBorrowed, setIsLoadingBorrowed] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setIsLoadingBorrowed(true);
            setIsLoadingHistory(true);

            apiClient<BorrowedBook[]>('/users/me/borrowed-books')
                .then(data => setBorrowedBooks(data || []))
                .catch(err => {
                    console.error("Failed to fetch borrowed books:", err);
                    toast({ title: "Error Loading Borrowed Books", description: err.message || "Could not load borrowed books.", variant: "destructive" });
                })
                .finally(() => setIsLoadingBorrowed(false));

            apiClient<ReadingHistoryApiResponse>('/users/me/reading-history?page=1&limit=50') // Fetch more history items if needed
                .then(data => setReadingHistory(data.history || []))
                .catch(err => {
                    console.error("Failed to fetch reading history:", err);
                    toast({ title: "Error Loading History", description: err.message || "Could not load reading history.", variant: "destructive" });
                })
                .finally(() => setIsLoadingHistory(false));
        };

        if (!authLoading && user) {
            fetchData();
        } else if (!authLoading && !user) {
            setIsLoadingBorrowed(false);
            setIsLoadingHistory(false);
            setBorrowedBooks([]);
            setReadingHistory([]);
        }
    }, [user, authLoading, toast]);

    const formatDate = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return 'N/A';
        try {
            return format(new Date(dateInput), 'PP'); //'MMM d, yyyy'
        } catch { return 'Invalid Date'; }
    };

    const formatDueDate = (dateInput: string | Date | undefined): string => {
         if (!dateInput) return 'N/A';
         try {
             const date = new Date(dateInput);
             const now = new Date();
             if (date < now) {
                 return `${formatDistanceToNow(date, { addSuffix: true })} (Overdue)`;
             }
             return formatDistanceToNow(date, { addSuffix: true });
         } catch { return 'Invalid Date'; }
    };

    const currentlyReadingCount = borrowedBooks.length;
    const booksCompletedCount = readingHistory.length;
    // Assuming wishlist count needs to be fetched separately or derived if wishlist page logic is moved here
    const wishlistCount = 0; // Placeholder - Fetch required

    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">Authenticating...</main>
            </div>
        );
    }
    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">Please log in to view your dashboard.</main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 p-4 md:p-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Welcome, {user.firstName}!</h1>
                            <p className="text-muted-foreground">Here's your reading activity overview.</p>
                        </div>
                        <Link href="/library">
                            <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Library className="mr-2 h-4 w-4"/> Browse Library
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                 <CardTitle className="text-sm font-medium">Currently Reading</CardTitle>
                                 <BookOpen className="h-4 w-4 text-muted-foreground" />
                             </CardHeader>
                             <CardContent>
                                 {isLoadingBorrowed ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{currentlyReadingCount}</div>}
                                 <p className="text-xs text-muted-foreground">Books checked out</p>
                             </CardContent>
                         </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                 <CardTitle className="text-sm font-medium">Books Completed</CardTitle>
                                 <CheckCircle className="h-4 w-4 text-muted-foreground" />
                             </CardHeader>
                             <CardContent>
                                 {isLoadingHistory ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{booksCompletedCount}</div>}
                                 <p className="text-xs text-muted-foreground">Based on your reading history</p>
                             </CardContent>
                         </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                 <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                                 <Heart className="h-4 w-4 text-muted-foreground" />
                             </CardHeader>
                             <CardContent>
                                 {/* Placeholder: Add wishlist fetching or link */}
                                 <Skeleton className="h-8 w-1/4" />
                                 {/* <div className="text-2xl font-bold">{wishlistCount}</div> */}
                                 <Link href="/wishlist" className="text-xs text-muted-foreground underline">View Wishlist</Link>
                             </CardContent>
                         </Card>
                    </div>

                    <Tabs defaultValue="currently-reading" className="space-y-4">
                         <TabsList>
                             <TabsTrigger value="currently-reading">Currently Reading</TabsTrigger>
                             <TabsTrigger value="reading-history">Reading History</TabsTrigger>
                         </TabsList>
                         <TabsContent value="currently-reading" className="space-y-4">
                              <Card>
                                <CardHeader>
                                    <CardTitle>Borrowed Books</CardTitle>
                                    <CardDescription>Books you currently have checked out.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingBorrowed ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-10 w-full" />
                                            <Skeleton className="h-10 w-full" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ) : borrowedBooks.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Book Title</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Author</TableHead>
                                                    <TableHead className="hidden md:table-cell">Issued On</TableHead>
                                                    <TableHead className="text-right">Due Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {borrowedBooks.map((item) => (
                                                    <TableRow key={item.loanId}>
                                                        <TableCell>
                                                             <Link href={`/books/${item.book?.id}`} className="font-medium hover:underline">
                                                                 {item.book?.title || 'Unknown Title'}
                                                             </Link>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">{item.book?.author || 'N/A'}</TableCell>
                                                        <TableCell className="hidden md:table-cell">{formatDate(item.issueDate)}</TableCell>
                                                        <TableCell className={`text-right ${new Date(item.dueDate) < new Date() ? 'text-destructive font-semibold' : ''}`}>
                                                            {formatDate(item.dueDate)}
                                                            <span className="block text-xs text-muted-foreground">{formatDueDate(item.dueDate)}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">You have no books currently borrowed.</p>
                                    )}
                                </CardContent>
                              </Card>
                         </TabsContent>
                         <TabsContent value="reading-history" className="space-y-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Reading History</CardTitle>
                                    <CardDescription>Books you have previously borrowed and returned.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingHistory ? (
                                         <div className="space-y-4">
                                             <Skeleton className="h-10 w-full" />
                                             <Skeleton className="h-10 w-full" />
                                             <Skeleton className="h-10 w-full" />
                                         </div>
                                    ) : readingHistory.length > 0 ? (
                                         <Table>
                                             <TableHeader>
                                                 <TableRow>
                                                     <TableHead>Book Title</TableHead>
                                                     <TableHead className="hidden sm:table-cell">Author</TableHead>
                                                     <TableHead className="hidden md:table-cell">Borrowed On</TableHead>
                                                     <TableHead className="text-right">Completed On</TableHead>
                                                 </TableRow>
                                             </TableHeader>
                                             <TableBody>
                                                 {readingHistory.map((item) => (
                                                     <TableRow key={item.loanId}>
                                                         <TableCell>
                                                             <Link href={`/books/${item.book?.id}`} className="font-medium hover:underline">
                                                                 {item.book?.title || 'Unknown Title'}
                                                             </Link>
                                                         </TableCell>
                                                         <TableCell className="hidden sm:table-cell">{item.book?.author || 'N/A'}</TableCell>
                                                         <TableCell className="hidden md:table-cell">{formatDate(item.issueDate)}</TableCell>
                                                         <TableCell className="text-right">{formatDate(item.completedDate)}</TableCell>
                                                     </TableRow>
                                                 ))}
                                             </TableBody>
                                         </Table>
                                    ) : (
                                         <p className="text-center text-muted-foreground py-4">No reading history found.</p>
                                    )}
                                </CardContent>
                             </Card>
                         </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}