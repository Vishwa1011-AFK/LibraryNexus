"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { UserInfoHeader } from "@/components/user-info-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Globe, Calendar, BookMarked, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { type Book } from "@/types";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function BookDetail() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBook = await apiClient<Book>(`/books/${bookId}`);
        setBook(fetchedBook);
      } catch (err: any) {
        setError(err.message || "Failed to load book details.");
        toast({ title: "Error", description: err.message || "Failed to load book details.", variant: "destructive" });
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
    try {
      setIsLoading(true);
      await apiClient(`/users/wishlist/me/${book.id}`, "POST");
      toast({ title: "Success", description: `${book.title} added to your wishlist.` });
    } catch (err: any) {
      const message = err.message?.includes("already in wishlist") ? "This book is already in your wishlist." : err.message || "Failed to add book to wishlist.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Skeleton />;
  if (error) return <AlertCircle className="text-destructive" />;
  if (!book) return <BookOpen className="text-muted-foreground" />;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {user && <UserInfoHeader name={`${user.firstName} ${user.lastName}`} email={user.email} isAdmin={user.isAdmin} />}
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-6">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md">
                <Image src={book.coverUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
              </div>
              {book.available !== undefined && (
                <Badge variant={book.available ? "success" : "destructive"}>{book.available ? "Available" : "Unavailable"}</Badge>
              )}
              <Button onClick={handleAddToWishlist} disabled={isLoading}><BookMarked className="mr-2 h-4 w-4" /> Add to Wishlist</Button>
              <Link href="/library"><Button variant="outline"><BookOpen className="mr-2 h-4 w-4" /> Go to Library</Button></Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              {book.author && <p className="text-muted-foreground">by <span className="text-primary">{book.author}</span></p>}
              {book.description && <p className="text-muted-foreground mb-8">{book.description}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {book.pages && <Card><CardContent>{book.pages} Pages</CardContent></Card>}
                {book.language && <Card><CardContent>{book.language}</CardContent></Card>}
                {book.publishDate && <Card><CardContent>{book.publishDate.split(",")[0]}</CardContent></Card>}
                {book.publisher && <Card><CardContent>{book.publisher}</CardContent></Card>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}