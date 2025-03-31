"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from 'next/navigation';
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Calendar, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { type ApiResponseWithMessage } from "@/types";
import { format } from 'date-fns';
import { ProtectedRoute } from "@/components/protected-route";

export default function IssueBookPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const bookId = searchParams.get('bookId');
    const bookTitle = searchParams.get('title') || "Selected Book";
    const isbn = searchParams.get('isbn') || "N/A";

    const [userEmail, setUserEmail] = useState("")
    const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) {
            toast({ title: "Error", description: "No book selected for issuing.", variant: "destructive" });
            router.replace('/admin');
        }
    }, [bookId, router, toast]);


    const handleIssueBook = async () => {
        setError(null);
        const emailTrimmed = userEmail.trim();
        if (!emailTrimmed) {
            setError("User Email is required.");
            toast({ title: "Validation Error", description: "Please enter the User Email.", variant: "destructive" });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
             setError("Please enter a valid email address.");
             toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
             return;
        }
        if (!issueDate) {
            setError("Issue Date is required.");
             toast({ title: "Validation Error", description: "Please select an Issue Date.", variant: "destructive" });
            return;
        }
        if (!bookId) {
             setError("Book ID is missing.");
             toast({ title: "Error", description: "Cannot issue book without a Book ID.", variant: "destructive" });
            return;
        }


        setIsLoading(true);
        try {
            const payload = {
                userEmail: emailTrimmed,
                issueDate: new Date(issueDate).toISOString()
            };
            const response = await apiClient<ApiResponseWithMessage>(`/admin/loans/issue/${bookId}`, 'POST', payload);
            toast({ title: "Success", description: response.message || `Book "${bookTitle}" issued successfully to ${emailTrimmed}.` });
            router.push(`/admin/books/${bookId}`);

        } catch (err: any) {
             const message = err.message || "Failed to issue book. Please check User Email and try again.";
             setError(message);
             toast({ title: "Issuing Failed", description: message, variant: "destructive" });
        } finally {
             setIsLoading(false);
        }
    };


    return (
         <ProtectedRoute adminOnly={true}>
            <div className="flex min-h-screen flex-col">
            <SiteHeader/>
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                     <div className="mb-6">
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4"/> Cancel Issuing
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Book</CardTitle>
                            <CardDescription>Issue "{bookTitle}" (ISBN: {isbn}) to a user.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="user-email">User Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="user-email"
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="Enter the borrower's email address"
                                            className="pl-10"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="issue-date">Date of Issue</Label>
                                     <div className="relative">
                                         <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                         <Input
                                            id="issue-date"
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                            className="pl-10"
                                            disabled={isLoading}
                                            required
                                        />
                                     </div>
                                </div>

                                {error && <p className="text-sm text-destructive text-center pt-2">{error}</p>}

                                <Button
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={handleIssueBook}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Issuing Book..." : "Confirm Issue"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            </div>
         </ProtectedRoute>
    )
}