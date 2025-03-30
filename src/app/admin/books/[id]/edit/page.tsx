"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { AdminBookForm } from "@/components/admin-book-form";
import { apiClient } from '@/lib/api';
import { type Book } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditBookPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const bookId = params.id as string;

    const [bookData, setBookData] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookData = useCallback(async () => {
        if (!bookId) {
            setError("Invalid Book ID.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const fetchedBook = await apiClient<Book>(`/api/admin/books/${bookId}`);
            setBookData(fetchedBook);
        } catch (err: any) {
            setError(err.message || "Failed to load book data for editing.");
            toast({ title: "Error Loading Book Data", description: err.message, variant: "destructive" });
            setBookData(null);
        } finally {
            setIsLoading(false);
        }
    }, [bookId, toast]);

    useEffect(() => {
        fetchBookData();
    }, [fetchBookData]);

    if (isLoading) {
        return (
             <div className="flex min-h-screen flex-col">
                 <SiteHeader />
                 <main className="flex-1 py-8">
                     <div className="container mx-auto px-4 max-w-3xl">
                         <Skeleton className="h-8 w-1/3 mb-6" />
                         <Skeleton className="h-10 w-1/2 mb-4" />
                         <Skeleton className="h-96 w-full" />
                     </div>
                 </main>
             </div>
        );
    }

    if (error || !bookData) {
         return (
             <div className="flex min-h-screen flex-col">
                 <SiteHeader />
                 <main className="flex-1 py-8">
                      <div className="container mx-auto px-4 max-w-3xl text-center">
                           <div className="mb-6 float-left">
                               <Button variant="outline" size="sm" onClick={() => router.back()}>
                                   <ArrowLeft className="mr-2 h-4 w-4"/> Cancel
                               </Button>
                           </div>
                          <div className="clear-both pt-10 text-destructive">
                               <p>{error || "Could not load book data."}</p>
                          </div>
                      </div>
                 </main>
             </div>
         );
    }


    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <AdminBookForm mode="edit" initialData={bookData} />
            </main>
        </div>
    );
}