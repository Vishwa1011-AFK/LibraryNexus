import { BookCard } from "@/components/book-card"
import { cn } from "@/lib/utils"

interface Book {
  id: number | string
  title: string
  author: string
  coverUrl: string
  category?: string
  rating?: number
  available?: boolean
}

interface BookGridProps {
  books: Book[]
  isAdmin?: boolean
  className?: string
  columns?: {
    sm?: number
    md?: number
    lg?: number
  }
}

export function BookGrid({
  books,
  isAdmin = false,
  className,
  columns = {
    sm: 2,
    md: 3,
    lg: 5,
  },
}: BookGridProps) {
  return (
    <div className={cn(`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6`, className)}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          category={book.category}
          rating={book.rating}
          available={book.available}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )
}

