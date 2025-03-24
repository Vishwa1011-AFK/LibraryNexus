import { SiteHeader } from "@/components/site-header"
import { UserInfoHeader } from "@/components/user-info-header"
import { BookGrid } from "@/components/book-grid"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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

  // In a real app, this would come from your auth context
  const userData = {
    name: "Diwakar Dubey",
    email: "dd34@gmail.com",
  }

  // In a real app, this would be state managed with pagination
  const currentPage = 1
  const totalPages = 3

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true}/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <UserInfoHeader name={userData.name} email={userData.email} isAdmin={isAdmin} />

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Books</h1>

            <div className="flex gap-2">
              <select className="bg-card text-sm rounded-md border border-input px-3 py-2">
                <option value="">All Categories</option>
                <option value="programming">Programming</option>
                <option value="algorithms">Algorithms</option>
                <option value="data-science">Data Science</option>
              </select>

              <select className="bg-card text-sm rounded-md border border-input px-3 py-2">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>

          <BookGrid
            books={books}
            isAdmin={isAdmin}
            columns={{
              sm: 2,
              md: 3,
              lg: 4,
            }}
            className="mb-8"
          />

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="/library?page=1" />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="/library?page=1" isActive={currentPage === 1}>
                  1
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="/library?page=2" >
                  2
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="/library?page=3" >
                  3
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext href="/library?page=2" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}

