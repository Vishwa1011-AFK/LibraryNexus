"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Pencil, User, Mail, Calendar, BookOpen } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { apiClient } from "@/lib/api"
import { type BorrowedBook } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from 'date-fns'

export default function AccountPage() {
    const { user, isLoading: authLoading } = useAuth()
    const { toast } = useToast()

    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
    const [isLoadingBooks, setIsLoadingBooks] = useState(true)
    const [errorBooks, setErrorBooks] = useState<string | null>(null)

    useEffect(() => {
        const fetchBorrowed = async () => {
            if (!user) {
                setIsLoadingBooks(false)
                return
            }

            setIsLoadingBooks(true)
            setErrorBooks(null)
            try {
                const data = await apiClient<BorrowedBook[]>('/users/me/borrowed-books')
                setBorrowedBooks(data || [])
            } catch (err: any) {
                setErrorBooks(err.message || "Failed to load borrowed books.")
                toast({ title: "Error", description: err.message || "Failed to load borrowed books.", variant: "destructive" })
            } finally {
                setIsLoadingBooks(false)
            }
        }

        if (!authLoading && user) fetchBorrowed()
        else if (!authLoading && !user) {
            setIsLoadingBooks(false)
            setBorrowedBooks([])
        }
    }, [user, authLoading, toast])

    const formatDate = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return 'N/A'
        try {
            return format(new Date(dateInput), 'PP')
        } catch {
            return 'Invalid Date'
        }
    }

    if (authLoading || (isLoadingBooks && user)) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <div className="space-y-8">
                            <div className="bg-card rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Skeleton className="h-8 w-1/4" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-1/2" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <Skeleton className="h-8 w-1/3" />
                                    <Skeleton className="h-6 w-1/4" />
                                </div>
                                <div className="bg-card rounded-lg overflow-hidden space-y-2 p-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4 text-center">Please log in to view your account.</div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="space-y-8">
                        <div className="bg-card rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Personal Info</h2>
                                <Link href="/account/edit">
                                    <Button variant="ghost" size="icon">
                                        <Pencil className="h-5 w-5 text-primary" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 w-28">
                                        <User className="h-5 w-5 text-primary" />
                                        <span className="text-muted-foreground">Name</span>
                                    </div>
                                    <span className="text-lg mx-2">:</span>
                                    <span>{`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.replace(/\s+/g, ' ').trim()}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 w-28">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <span className="text-muted-foreground">Email ID</span>
                                    </div>
                                    <span className="text-lg mx-2">:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 w-28">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <span className="text-muted-foreground">Date of birth</span>
                                    </div>
                                    <span className="text-lg mx-2">:</span>
                                    <span>{user.birthDate ? formatDate(user.birthDate) : 'Not Set'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <BookOpen className="h-6 w-6" /> My Books
                                    {!isLoadingBooks && <span className="text-primary">({borrowedBooks.length})</span>}
                                </h2>
                            </div>
                            {isLoadingBooks ? (
                                <div className="bg-card rounded-lg overflow-hidden space-y-2 p-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : errorBooks ? (
                                <div className="bg-card rounded-lg p-6 text-center text-destructive">{errorBooks}</div>
                            ) : borrowedBooks.length > 0 ? (
                                <div className="bg-card rounded-lg overflow-hidden">
                                    <div className="p-4 grid grid-cols-[1fr_auto] items-center gap-4 font-medium border-b bg-muted/50">
                                        <div>Book Title / Author</div>
                                        <div className="text-right">Due Date</div>
                                    </div>
                                    {borrowedBooks.map((item, index) => (
                                        <div key={item.loanId || item.book?.id || index} className="flex justify-between items-center p-4 border-b border-muted last:border-0">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-primary font-semibold">{index + 1}.</span>
                                                <Link href={`/books/${item.book?.id}`} className="hover:underline">
                                                    <div>
                                                        <span className="block font-medium">{item.book?.title || 'Unknown Book'}</span>
                                                        <span className="block text-sm text-muted-foreground">{item.book?.author || 'Unknown Author'}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">{formatDate(item.dueDate)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">You have no books currently borrowed.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
