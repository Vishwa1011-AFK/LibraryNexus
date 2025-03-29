"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { UserInfoHeader } from "@/components/user-info-header"
import { BookGrid } from "@/components/book-grid"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // In a real app, this would come from your auth context
  const userData = {
    name: "Diwakar Dubey",
    email: "dd34@gmail.com",
  }

  // In a real app, this would be state managed with pagination
  const currentPage = 1
  const totalPages = 3

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/80">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <UserInfoHeader name={userData.name} email={userData.email} isAdmin={isAdmin} />

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Books
                <span className="text-sm font-normal text-muted-foreground">({books.length} items)</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  className="pl-10 border-input bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select defaultValue="all" value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px] border-input bg-background">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="algorithms">Algorithms</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="newest" value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] border-input bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                    <SelectItem value="z-a">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <BookGrid
            books={books}
            isAdmin={isAdmin}
            columns={{
              sm: 2,
              md: 3,
              lg: 5,
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
                <PaginationLink href="/library?page=2">2</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="/library?page=3">3</PaginationLink>
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

