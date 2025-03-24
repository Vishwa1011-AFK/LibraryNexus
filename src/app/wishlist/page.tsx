import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

// Sample wishlist data
const wishlistData = [
  { id: 1, title: "To Kill a Mockingbird", isbn: "9780061120084", author: "Keyley Jenner" },
  { id: 2, title: "To Kill a Mockingbird", isbn: "9780061120084", author: "Keyley Jenner" },
  { id: 3, title: "To Kill a Mockingbird", isbn: "9780061120084", author: "Keyley Jenner" },
  { id: 4, title: "To Kill a Mockingbird", isbn: "9780061120084", author: "Keyley Jenner" },
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
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    dateOfIssue: "20-06-2024",
    dateOfSubmission: "30-06-2024",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    dateOfIssue: "20-06-2024",
    dateOfSubmission: "30-06-2024",
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    dateOfIssue: "20-06-2024",
    dateOfSubmission: "30-06-2024",
  },
]

export default function WishlistPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 border-b border-muted pb-4">
            <div className="flex-1">
              <span className="text-lg">Name</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">Diwakar Dubey</span>
            </div>
            <div className="flex-1">
              <span className="text-lg">Email ID</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">dd34@gmail.com</span>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                My Books <span className="text-primary">(4)</span>
              </h2>

              <div className="overflow-hidden rounded-lg border border-muted">
                <div className="grid grid-cols-[1fr_auto_auto] bg-card p-4 font-medium">
                  <div>
                    <span>Book</span>
                    <span className="block text-xs text-primary">ISBN</span>
                  </div>
                  <div className="text-center px-6">DoI</div>
                  <div className="text-center px-6">DoS</div>
                </div>

                {borrowedBooks.map((book) => (
                  <div key={book.id} className="grid grid-cols-[1fr_auto_auto] border-t border-muted p-4">
                    <div>
                      <span className="block">{book.title}</span>
                      <span className="block text-xs text-primary">{book.isbn}</span>
                    </div>
                    <div className="text-center px-6">{book.dateOfIssue}</div>
                    <div className="text-center px-6">
                      <span className="whitespace-nowrap">—</span>
                      <span className="ml-2">{book.dateOfSubmission}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                My WishList <span className="text-primary">(4)</span>
              </h2>

              <div className="overflow-hidden rounded-lg border border-muted">
                <div className="grid grid-cols-[1fr_1fr_auto] bg-card p-4 font-medium">
                  <div>
                    <span>Book</span>
                    <span className="block text-xs text-primary">ISBN</span>
                  </div>
                  <div>Author</div>
                  <div className="text-center text-primary">Remove</div>
                </div>

                {wishlistData.map((book) => (
                  <div key={book.id} className="grid grid-cols-[1fr_1fr_auto] border-t border-muted p-4">
                    <div>
                      <span className="block">{book.title}</span>
                      <span className="block text-xs text-primary">{book.isbn}</span>
                    </div>
                    <div>{book.author}</div>
                    <div className="text-center">
                      <Button variant="ghost" size="icon" className="text-primary">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

