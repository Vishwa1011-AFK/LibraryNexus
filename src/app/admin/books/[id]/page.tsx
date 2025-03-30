"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Book, FileText, Globe, ArrowLeft, Edit, BookUp, BookOpen, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api";
import { type Book as BookType, type AdminIssueHistoryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

export default function AdminBookDetail() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const bookId = params.id as string;
    const isEditing = searchParams.get('action') === 'edit';

    const [book, setBook] = useState<BookType | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [errorBook, setErrorBook] = useState<string | null>(null);

    const fetchBookDetails = useCallback(async () => {
        if (!bookId) return;
        setIsLoadingBook(true);
        setErrorBook(null);
        try {
            const fetchedBook = await apiClient<BookType>(`/api/admin/books/${bookId}`);
            setBook(fetchedBook);
        } catch (err: any) {
            setErrorBook(err.message || "Failed to load book details.");
            toast({ title: "Error Loading Book", description: err.message, variant: "destructive" });
            setBook(null);
        } finally {
            setIsLoadingBook(false);
        }
    }, [bookId, toast]);

    useEffect(() => {
        fetchBookDetails();
    }, [fetchBookDetails]);

    const formatDate = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return 'N/A';
        try {
            return format(new Date(dateInput), 'PPpp');
        } catch {
            return 'Invalid Date';
        }
    };

    const issueHistoryColumns: { key: string; header: string; cell: (item: AdminIssueHistoryItem) => React.ReactNode; sortable?: boolean }[] = [
        {
            key: "id",
            header: "Loan ID",
            cell: (item: AdminIssueHistoryItem) => item.id,
        },
        {
            key: "userId",
            header: "User",
            cell: (item: AdminIssueHistoryItem) => item.userName || item.userEmail || item.userId,
        },
        {
            key: "issuedOn",
            header: "Issued On",
            cell: (item: AdminIssueHistoryItem) => formatDate(item.issuedOn),
            sortable: true,
        },
        {
            key: "submissionDate",
            header: "Due Date",
            cell: (item: AdminIssueHistoryItem) => formatDate(item.submissionDate),
            sortable: true,
        },
        {
            key: "returnedDate",
            header: "Returned On",
            cell: (item: AdminIssueHistoryItem) => item.returnedDate ? formatDate(item.returnedDate) : '-',
            sortable: true,
        },
        {
            key: "status",
            header: "Status",
            cell: (item: AdminIssueHistoryItem) => {
                const status = item.status;
                let variant: "success" | "destructive" | "warning" | "default" = "default";
                if (status === 'Returned' || status === 'Submitted') variant = 'success';
                else if (status === 'Issued') variant = 'default';
                else if (status === 'Overdue') variant = 'destructive';
                return <Badge variant={variant}>{status}</Badge>;
            }
        },
    ];

    if (isLoadingBook) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader/>
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-8 w-1/3 mb-6" />
                        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
                            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-10 w-1/3" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-1/3 mb-6" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </main>
            </div>
        );
    }

    if (errorBook || !book) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader/>
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4 text-center">
                         <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4 float-left">
                             <ArrowLeft className="mr-2 h-4 w-4"/> Back to Books List
                         </Button>
                         <div className="clear-both text-destructive pt-10">
                            <p>{errorBook || "Book not found."}</p>
                         </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader/>
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back to Books List
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
                        <div>
                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md">
                                <Image
                                    src={book.coverUrl || book.cover || "/placeholder.svg"}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    priority
                                />
                            </div>
                            <Badge variant={book.available ? "success" : "destructive"} className="mt-4 block w-fit text-xs sm:text-sm">
                                {book.available ? "Available" : "Unavailable"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                                {book.availableCopies ?? 'N/A'} / {book.totalCopies ?? 'N/A'} copies available
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold">{book.title}</h1>
                                    <p className="text-md sm:text-lg text-muted-foreground">by {book.author}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">ISBN: {book.isbn}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        toast({title: "TODO", description: "Implement Edit Book UI/Modal"});
                                    }}
                                >
                                    <Edit className="mr-1.5 h-4 w-4"/> Edit
                                </Button>
                            </div>

                            <p className="text-md sm:text-lg font-semibold mb-4 sm:mb-1">
                                Location: {book.shelf || book.location || 'N/A'}
                            </p>

                            <div className="flex flex-wrap gap-4 my-6">
                                <Link href={`/admin/issue?bookId=${book.id}&title=${encodeURIComponent(book.title)}&isbn=${book.isbn}`}>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <BookUp className="mr-2 h-4 w-4"/> Issue This Book
                                    </Button>
                                </Link>
                            </div>

                            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                                {book.description || "No description available."}
                            </p>

                            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 p-2 border rounded-md bg-muted/50">
                                    <FileText className="h-4 w-4 text-primary shrink-0" />
                                    <span>{book.pages ? `${book.pages} Pages` : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 p-2 border rounded-md bg-muted/50">
                                    <Globe className="h-4 w-4 text-primary shrink-0" />
                                    <span>{book.language || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 p-2 border rounded-md bg-muted/50">
                                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                                    <span>{book.category || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 p-2 border rounded-md bg-muted/50">
                                    <Calendar className="h-4 w-4 text-primary shrink-0"/>
                                    <span>Pub: {book.publishDate ? format(new Date(book.publishDate), 'PP') : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 p-2 border rounded-md bg-muted/50">
                                    <span>Pub: {book.publisher || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Book className="h-5 w-5 text-primary" />
                            Issue History
                        </h2>

                         <DataTable
                            columns={issueHistoryColumns}
                            data={book.issueHistory || []}
                            pageSize={10}
                            searchable
                            searchKeys={['userId', 'userName', 'userEmail']}
                         />
                         {(!book.issueHistory || book.issueHistory.length === 0) && (
                              <p className="text-center text-muted-foreground py-6">No issue history found for this book.</p>
                         )}
                    </div>
                </div>
            </main>
        </div>
    )
}