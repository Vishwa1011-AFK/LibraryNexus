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
    lg: 4,
  },
}: BookGridProps) {
  const getColumnsClass = () => {
    const classes = []

    if (columns.sm) classes.push(`grid-cols-${columns.sm}`)
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`)

    return classes.join(" ")
  }

  return (
    <div className={cn(`grid ${getColumnsClass()} gap-4 md:gap-6`, className)}>
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

