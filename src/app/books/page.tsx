import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample book data
const books = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    rating: 4.5,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    rating: 4.8,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    rating: 4.2,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Sci-Fi",
    rating: 4.7,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 5,
    title: "The Four Winds",
    author: "Kristin Hannah",
    category: "Historical Fiction",
    rating: 4.4,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 6,
    title: "The Vanishing Half",
    author: "Brit Bennett",
    category: "Fiction",
    rating: 4.3,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 7,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    category: "Sci-Fi",
    rating: 4.1,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
  {
    id: 8,
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    category: "Fantasy",
    rating: 4.6,
    coverUrl: "/placeholder.svg?height=250&width=180",
  },
]

export default function BooksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Books</h1>
              <p className="text-muted-foreground">Browse our collection of digital books</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {books.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <Card className="h-full overflow-hidden bg-muted hover:bg-muted/80 transition-colors border-muted">
                  <CardContent className="p-3">
                    <div className="aspect-[2/3] relative mb-3">
                      <Image
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-medium line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between items-center">
                    <Badge variant="outline" className="bg-secondary text-xs">
                      {book.category}
                    </Badge>
                    <div className="text-xs text-muted-foreground">★ {book.rating}</div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

