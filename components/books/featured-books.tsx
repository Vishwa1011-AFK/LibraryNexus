"use client"

import { useQuery } from "@tanstack/react-query"
import { BookCard } from "./book-card"
import type { Book } from "@/types"
import type { BookStatus } from "@/types"

// Sample book data
const sampleBooks = [
  {
    id: "1",
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "available" as const,
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "borrowed" as const,
  },
  {
    id: "3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "available" as const,
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "reserved" as const,
  },
]

// This would be replaced with a real API call
const getFeaturedBooks = async (): Promise<Book[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return sampleBooks
}

interface FeaturedBooksProps {
  isAdmin?: boolean
}

export function FeaturedBooks({ isAdmin = false }: FeaturedBooksProps) {
  const {
    data: books,
    isLoading,
    error,
  } = useQuery<Book[]>({
    queryKey: ["featuredBooks"],
    queryFn: getFeaturedBooks,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Featured Books</h2>
        <div className="book-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="book-cover skeleton"></div>
              <div className="h-4 skeleton rounded w-3/4"></div>
              <div className="h-3 skeleton rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading featured books</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Featured Books</h2>
      <div className="book-grid">
        {books?.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            status={book.status as BookStatus}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

