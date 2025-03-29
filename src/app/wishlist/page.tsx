"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { UserInfoHeader } from "@/components/user-info-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample wishlist data
const wishlistData = [
  { id: 1, title: "To Kill a Mockingbird", isbn: "9780061120084", author: "Keyley Jenner" },
  { id: 2, title: "1984", isbn: "9780451524935", author: "George Orwell" },
  { id: 3, title: "The Great Gatsby", isbn: "9780743273565", author: "F. Scott Fitzgerald" },
  { id: 4, title: "Pride and Prejudice", isbn: "9780141439518", author: "Jane Austen" },
  { id: 5, title: "The Catcher in the Rye", isbn: "9780316769488", author: "J.D. Salinger" },
  { id: 6, title: "To the Lighthouse", isbn: "9780156907392", author: "Virginia Woolf" },
]

// Sample borrowed books data
const borrowedBooks = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    dateOfIssue: "20-06-2024",
    dateOfSubmission: "30-06-2024",
  },
  {
    id: 2,
    title: "1984",
    isbn: "9780451524935",
    dateOfIssue: "15-06-2024",
    dateOfSubmission: "25-06-2024",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    isbn: "9780743273565",
    dateOfIssue: "10-06-2024",
    dateOfSubmission: "20-06-2024",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    isbn: "9780141439518",
    dateOfIssue: "05-06-2024",
    dateOfSubmission: "15-06-2024",
  },
]

export default function WishlistPage() {
  // In a real app, this would come from your auth context
  const userData = {
    name: "Diwakar Dubey",
    email: "dd34@gmail.com",
  }

  const [searchQuery, setSearchQuery] = useState("")

  // Filter function for search
  const filteredWishlist = wishlistData.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery),
  )

  const filteredBorrowedBooks = borrowedBooks.filter(
    (book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.isbn.includes(searchQuery),
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/80">
      <SiteHeader/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <UserInfoHeader name={userData.name} email={userData.email} />

          <div className="space-y-10">
            <div className="relative max-w-sm mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                className="pl-10 border-input bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                My Books
                <span className="ml-2 text-primary">({borrowedBooks.length})</span>
              </h2>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Date of Issue</TableHead>
                      <TableHead>Date of Submission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBorrowedBooks.length > 0 ? (
                      filteredBorrowedBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>
                            <div>
                              <span className="block">{book.title}</span>
                              <span className="block text-xs text-primary">{book.isbn}</span>
                            </div>
                          </TableCell>
                          <TableCell>{book.dateOfIssue}</TableCell>
                          <TableCell>{book.dateOfSubmission}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                My WishList
                <span className="ml-2 text-primary">({wishlistData.length})</span>
              </h2>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWishlist.length > 0 ? (
                      filteredWishlist.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>
                            <div>
                              <span className="block">{book.title}</span>
                              <span className="block text-xs text-primary">{book.isbn}</span>
                            </div>
                          </TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:text-destructive"
                              aria-label={`Remove ${book.title} from wishlist`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

