"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowUpRight, Library, CheckCircle, Heart } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { type BorrowedBook, type ReadingHistoryItem, type ReadingHistoryApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
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
                    toast({ title: "Error Loading Books", description: err.message || "Could not load borrowed books.", variant: "destructive" });
                })
                .finally(() => setIsLoadingBorrowed(false));

            apiClient<ReadingHistoryApiResponse>('/users/me/reading-history?page=1&limit=50')
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
            return format(new Date(dateInput), 'PP');
        } catch { return 'Invalid Date'; }
    };

    const currentlyReadingCount = borrowedBooks.length;
    const booksCompletedCount = readingHistory.length;

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
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                            <p className="text-muted-foreground">Manage your borrowed books and reading activity</p>
                        </div>
                        <Link href="/library">
                            <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Library className="mr-2 h-4 w-4"/> Browse Library
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
