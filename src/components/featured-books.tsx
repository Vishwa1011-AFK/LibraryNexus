import { BookCard } from "@/components/book-card"

// Sample book data
const books = [
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

export function FeaturedBooks({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Featured Books</h2>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} {...book} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  )
}

