import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

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

export default function AdminBooksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAdmin={true} />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Books</h1>
          <Button className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Filters</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue="all">
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
                  <Select defaultValue="all">
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
                  <Select defaultValue="all">
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
              <div className="relative w-full max-w-sm">
                <Input type="search" placeholder="Search books..." className="pr-10" />
              </div>
              <Select defaultValue="newest">
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
            <div className="book-grid">
              {books.map((book) => (
                <BookCard key={book.id} {...book} isAdmin={true} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

