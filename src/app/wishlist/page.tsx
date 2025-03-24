import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { UserInfoHeader } from "@/components/user-info-header"
import { DataTable } from "@/components/ui/data-table"

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

  const borrowedBooksColumns = [
    {
      key: "title",
      header: "Book",
      cell: (book: (typeof borrowedBooks)[0]) => (
        <div>
          <span className="block">{book.title}</span>
          <span className="block text-xs text-primary">{book.isbn}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "dateOfIssue",
      header: "Date of Issue",
      cell: (book: (typeof borrowedBooks)[0]) => book.dateOfIssue,
      sortable: true,
    },
    {
      key: "dateOfSubmission",
      header: "Date of Submission",
      cell: (book: (typeof borrowedBooks)[0]) => book.dateOfSubmission,
      sortable: true,
    },
  ]

  const wishlistColumns = [
    {
      key: "title",
      header: "Book",
      cell: (book: (typeof wishlistData)[0]) => (
        <div>
          <span className="block">{book.title}</span>
          <span className="block text-xs text-primary">{book.isbn}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "author",
      header: "Author",
      cell: (book: (typeof wishlistData)[0]) => book.author,
      sortable: true,
    },
    {
      key: "actions",
      header: "",
      cell: (book: (typeof wishlistData)[0]) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-destructive"
            aria-label={`Remove ${book.title} from wishlist`}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true}/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <UserInfoHeader name={userData.name} email={userData.email} />

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                My Books
                <span className="ml-2 text-primary">({borrowedBooks.length})</span>
              </h2>

              <DataTable
                data={borrowedBooks}
                columns={borrowedBooksColumns}
                pageSize={5}
                searchable
                searchKeys={["title", "isbn"]}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                My WishList
                <span className="ml-2 text-primary">({wishlistData.length})</span>
              </h2>

              <DataTable
                data={wishlistData}
                columns={wishlistColumns}
                pageSize={5}
                searchable
                searchKeys={["title", "isbn", "author"]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

