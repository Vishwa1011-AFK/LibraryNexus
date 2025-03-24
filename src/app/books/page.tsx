"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/layout/navbar"
import { BookCard } from "@/components/books/book-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Book } from "@/types"

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
  {
    id: "5",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "available" as const,
  },
  {
    id: "6",
    title: "1984",
    author: "George Orwell",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "borrowed" as const,
  },
  {
    id: "7",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "available" as const,
  },
  {
    id: "8",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "/placeholder.svg?height=240&width=160",
    status: "reserved" as const,
  },
]

// This would be replaced with a real API call
const getBooks = async (filters: any): Promise<Book[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredBooks = [...sampleBooks]

  // Apply filters
  if (filters.category && filters.category !== "all") {
    // In a real app, this would filter by category
  }

  if (filters.status && filters.status !== "all") {
    filteredBooks = filteredBooks.filter((book) => book.status === filters.status)
  }

  // Apply sorting
  if (filters.sortBy === "title-asc") {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
  } else if (filters.sortBy === "title-desc") {
    filteredBooks.sort((a, b) => b.title.localeCompare(a.title))
  }

  return filteredBooks
}

export default function BooksPage() {
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [year, setYear] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ["books", { category, status, year, sortBy }],
    queryFn: () => getBooks({ category, status, year, sortBy }),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Filters</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="borrowed">Borrowed</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="year">Publication Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Browse Books</h1>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="book-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="book-cover skeleton"></div>
                    <div className="h-4 skeleton rounded w-3/4"></div>
                    <div className="h-3 skeleton rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="book-grid">
                {books?.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    coverUrl={book.coverUrl}
                    status={book.status as "available" | "borrowed" | "reserved"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

