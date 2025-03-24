import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

// Sample books data
const books = [
  {
    id: 1,
    title: "Systemic Risk",
    author: "Malcolm H. D. Kemp",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 2,
    title: "Data Structures & Algorithm",
    author: "Sunil Kumar",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 3,
    title: "Analysis of Algorithm",
    author: "Malcolm H. D. Kemp",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: false,
  },
  {
    id: 4,
    title: "The Master of Algorithm",
    author: "Pedro Domingos",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 5,
    title: "Analysis of Algorithm",
    author: "Malcolm H. D. Kemp",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 6,
    title: "Systemic Risk",
    author: "Malcolm H. D. Kemp",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: false,
  },
  {
    id: 7,
    title: "Data Structures & Algorithm",
    author: "Sunil Kumar",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 8,
    title: "The Master of Algorithm",
    author: "Pedro Domingos",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 9,
    title: "Systemic Risk",
    author: "Malcolm H. D. Kemp",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 10,
    title: "The Master of Algorithm",
    author: "Pedro Domingos",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 11,
    title: "Data Structures & Algorithm",
    author: "Sunil Kumar",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
  {
    id: 12,
    title: "Analysis of Algorithm",
    author: "Malcolm H. D. Kemp",
    coverUrl: "/placeholder.svg?height=250&width=180",
    available: true,
  },
]

export default function LibraryPage() {
  const isAdmin = true // This would normally be determined by authentication

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 border-b border-muted pb-4">
            <div>
              <span className="text-lg">Name</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">Diwakar Dubey</span>
              {isAdmin && <span className="ml-2 px-2 py-1 text-xs bg-orange-600 rounded text-white">Admin</span>}
            </div>
            <div>
              <span className="text-lg">Email ID</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">dd34@gmail.com</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-8">Books</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                href={isAdmin ? `/admin/books/${book.id}` : `/books/${book.id}`}
                className="bg-card rounded-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-4">
                  <div className="aspect-[3/4] relative mb-4">
                    <Image src={book.coverUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                  </div>
                  <h3 className="font-medium mb-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  <div
                    className={`text-center py-1 rounded-md text-sm ${
                      book.available ? "bg-green-900/30 text-green-500" : "bg-red-900/30 text-red-500"
                    }`}
                  >
                    {book.available ? "Available" : "Unavailable"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Link href="/library?page=1" className="px-3 py-1 bg-card rounded-md text-primary">
                1
              </Link>
              <Link href="/library?page=2" className="px-3 py-1 bg-card rounded-md text-muted-foreground">
                2
              </Link>
              <Link href="/library?page=3" className="px-3 py-1 bg-card rounded-md text-muted-foreground">
                3
              </Link>
              <Link href="/library?page=2" className="px-3 py-1 bg-card rounded-md text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right h-5 w-5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

