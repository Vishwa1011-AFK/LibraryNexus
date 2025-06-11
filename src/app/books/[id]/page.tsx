"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Globe, Calendar, BookMarked, AlertCircle, FileText, Layers3, MapPin } from "lucide-react";
import { apiClient } from "@/lib/api";
import { type Book } from "@/types";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export default function BookDetail() {
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
           setError("Invalid book ID.");
           setIsLoading(false);
           return;
        };
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBook = await apiClient<Book>(`/books/${bookId}`);
        setBook(fetchedBook);
      } catch (err: any) {
        setError(err.message || "Failed to load book details.");
        toast({ title: "Error", description: err.message || "Failed to load book details.", variant: "destructive" });
         setBook(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, toast]);

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to add books to your wishlist.", variant: "destructive" });
      return;
    }
    if (!book) return;
    setIsWishlistLoading(true);
    try {
      await apiClient(`/users/wishlist/me/${book.id}`, "POST");
      toast({ title: "Success", description: `${book.title} added to your wishlist.` });
    } catch (err: any) {
      const message = err.message?.includes("already in wishlist")
          ? "This book is already in your wishlist."
          : err.message || "Failed to add book to wishlist.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const formatDate = (dateInput: string | Date | undefined): string => {
     if (!dateInput) return 'N/A';
     try {
         const date = new Date(dateInput);
          if (isNaN(date.getTime())) return 'Invalid Date';
         return format(date, 'PP');
     } catch {
         return 'Invalid Date Format';
     }
  };


  if (isLoading || authLoading) {
       return (
           <div className="flex min-h-screen flex-col">
               <SiteHeader />
               <main className="flex-1 py-8">
                   <div className="container mx-auto px-4">
                       <div className="grid md:grid-cols-[300px_1fr] gap-8">
                           <div className="space-y-6">
                               <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                               <Skeleton className="h-7 w-24" />
                               <Skeleton className="h-10 w-40" />
                               <Skeleton className="h-10 w-36" />
                           </div>
                           <div>
                               <Skeleton className="h-9 w-3/4 mb-2" />
                               <Skeleton className="h-6 w-1/2 mb-6" />
                               <Skeleton className="h-24 w-full mb-8" />
                               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                  <Skeleton className="h-16 w-full rounded-md" />
                                  <Skeleton className="h-16 w-full rounded-md" />
                                  <Skeleton className="h-16 w-full rounded-md" />
                                  <Skeleton className="h-16 w-full rounded-md" />
                               </div>
                           </div>
                       </div>
                   </div>
               </main>
           </div>
       );
   }

  if (error || !book) {
     return (
         <div className="flex min-h-screen flex-col">
             <SiteHeader />
             <main className="flex-1 flex flex-col items-center justify-center py-8 text-center px-4">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                 <h2 className="text-2xl font-semibold mb-2">Could Not Load Book</h2>
                 <p className="text-muted-foreground mb-6">{error || "The requested book could not be found or loaded."}</p>
                 <Link href="/books">
                    <Button variant="outline"><BookOpen className="mr-2 h-4 w-4" /> Back to Books</Button>
                 </Link>
             </main>
         </div>
     );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-6">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md bg-muted">
                <Image
                    src={book.coverUrl || book.cover || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                />
              </div>
              {book.available !== undefined && (
                 <Badge variant={book.available ? "success" : "destructive"} className="text-sm py-1 px-3">
                     {book.available ? "Available for Borrowing" : "Currently Unavailable"}
                 </Badge>
              )}
              <Button onClick={handleAddToWishlist} disabled={isWishlistLoading}>
                  <BookMarked className="mr-2 h-4 w-4" />
                  {isWishlistLoading ? 'Adding...' : 'Add to Wishlist'}
              </Button>
              <Link href="/library">
                  <Button variant="outline"><BookOpen className="mr-2 h-4 w-4" /> Back to Library</Button>
              </Link>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-1">{book.title}</h1>
              {book.author && (
                  <p className="text-lg text-muted-foreground mb-1">by <span className="text-primary font-medium">{book.author}</span></p>
              )}
               <p className="text-sm text-muted-foreground mb-4">ISBN: {book.isbn || 'N/A'}</p>

              {book.description && (
                  <Card className="mb-6 bg-muted/30 border-muted">
                      <CardHeader>
                         <CardTitle className="text-lg font-semibold">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-muted-foreground">{book.description}</p>
                      </CardContent>
                  </Card>
              )}

              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-2"> <Layers3 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/> <span><span className="font-medium">Category:</span> {book.category || 'N/A'}</span></div>
                  <div className="flex items-start space-x-2"> <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/> <span><span className="font-medium">Pages:</span> {book.pages || 'N/A'}</span></div>
                  <div className="flex items-start space-x-2"> <Globe className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/> <span><span className="font-medium">Language:</span> {book.language || 'N/A'}</span></div>
                  <div className="flex items-start space-x-2"> <Calendar className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/> <span><span className="font-medium">Published:</span> {formatDate(book.publishDate)}</span></div>
                  <div className="flex items-start space-x-2"> <BookOpen className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/> <span><span className="font-medium">Publisher:</span> {book.publisher || 'N/A'}</span></div>
                   <div className="flex items-start space-x-2"> <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/> <span><span className="font-medium">Location:</span> {book.location || 'N/A'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}