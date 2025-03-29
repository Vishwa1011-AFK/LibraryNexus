import { BookCard } from "@/components/book-card"
import { cn } from "@/lib/utils"
import { type Book } from "@/types";

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
  columns = { sm: 2, md: 3, lg: 5 },
}: BookGridProps) {
    return (
        <div className={cn(`grid grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-4 md:gap-6`, className)}>
        {books.map((book) => (
            <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl || book.cover || "/placeholder.svg"}
                category={book.category}
                rating={book.rating} 
                available={book.available}
                isAdmin={isAdmin}
            />
        ))}
        </div>
    )
}