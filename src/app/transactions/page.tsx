import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample transaction data
const borrowedBooks = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    borrowDate: "2023-10-15",
    dueDate: "2023-11-15",
    status: "active",
  },
  {
    id: "2",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    borrowDate: "2023-09-20",
    dueDate: "2023-10-20",
    status: "overdue",
  },
]

const reservedBooks = [
  {
    id: "3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    reserveDate: "2023-10-25",
    availableDate: "2023-11-05",
    status: "pending",
  },
]

const historyBooks = [
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowDate: "2023-08-10",
    returnDate: "2023-09-10",
    status: "returned",
  },
  {
    id: "5",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    borrowDate: "2023-07-05",
    returnDate: "2023-08-05",
    status: "returned",
  },
]

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">My Books</h1>

        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
            <TabsTrigger value="reserved">Reserved</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="borrowed">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.borrowDate}</TableCell>
                      <TableCell>{book.dueDate}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            book.status === "active"
                              ? "bg-[#77ff9d]/20 text-[#009a2b]"
                              : "bg-[#ff8181]/20 text-[#c22424]"
                          }`}
                        >
                          {book.status === "active" ? "Active" : "Overdue"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="reserved">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Reserve Date</TableHead>
                    <TableHead>Available Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.reserveDate}</TableCell>
                      <TableCell>{book.availableDate}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-[#d97921]/20 text-[#d97921]">Pending</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.borrowDate}</TableCell>
                      <TableCell>{book.returnDate}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-[#e1e1e1]/20 text-[#9a9a9a]">Returned</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

