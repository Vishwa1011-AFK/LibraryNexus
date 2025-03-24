"use client"

import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Star, Share2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { bookStatuses } from "@/lib/utils"
import type { Book } from "@/types"

// This would be replaced with a real API call
const getBook = async (id: string): Promise<Book> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock book data
  return {
    id,
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverUrl: "/placeholder.svg?height=400&width=260",
    status: "available",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined. Santiago's journey teaches us about the essential wisdom of listening to our hearts, of recognizing opportunity and learning to read the omens strewn along life's path, and, most importantly, to follow our dreams.",
    publishedDate: "1988",
    pages: 197,
    genre: "Fiction, Philosophy",
    rating: 4.5,
    isbn: "978-0062315007",
    publisher: "HarperOne",
    language: "English",
  }
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuthStore()

  const { data: book, isLoading } = useQuery<Book>({
    queryKey: ["book", params.id],
    queryFn: () => getBook(params.id),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-8">
            <div className="book-cover h-[400px] w-[260px] skeleton"></div>
            <div className="space-y-6">
              <div className="h-10 skeleton rounded w-1/2"></div>
              <div className="h-6 skeleton rounded w-1/3"></div>
              <div className="flex flex-wrap gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 skeleton rounded w-24"></div>
                ))}
              </div>
              <div>
                <div className="h-6 skeleton rounded w-1/4 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 skeleton rounded"></div>
                  <div className="h-4 skeleton rounded"></div>
                  <div className="h-4 skeleton rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Book not found</h1>
            <p className="text-muted-foreground">The book you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    )
  }

  const statusIndicator = bookStatuses[book.status]?.indicator || "bg-gray-400"
  const statusLabel = bookStatuses[book.status]?.label || book.status

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          <div>
            <div className="book-cover h-[400px] w-[260px]">
              <img src={book.coverUrl || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
            </div>
            <div className="mt-4 space-y-2">
              {isAuthenticated && (
                <>
                  <Button className="w-full bg-primary text-primary-foreground">Borrow Book</Button>
                  <Button variant="outline" className="w-full">
                    Add to Wishlist
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-xl text-muted-foreground">{book.author}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{book.pages} pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Published {book.publishedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span>{book.rating}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusIndicator}`} />
                <span className="capitalize">{statusLabel}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{book.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-medium">Genre</p>
                  <p className="text-muted-foreground">{book.genre}</p>
                </div>
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-muted-foreground">{book.language}</p>
                </div>
                <div>
                  <p className="font-medium">ISBN</p>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
                <div>
                  <p className="font-medium">Publisher</p>
                  <p className="text-muted-foreground">{book.publisher}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

