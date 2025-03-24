import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample transaction data
const activeTransactions = [
  {
    id: "1",
    user: "John Doe",
    book: "Atomic Habits",
    borrowDate: "2023-10-15",
    dueDate: "2023-11-15",
    status: "active",
  },
  {
    id: "2",
    user: "Jane Smith",
    book: "The Hobbit",
    borrowDate: "2023-09-20",
    dueDate: "2023-10-20",
    status: "overdue",
  },
  {
    id: "3",
    user: "Robert Johnson",
    book: "1984",
    borrowDate: "2023-10-05",
    dueDate: "2023-11-05",
    status: "active",
  },
]

const reservations = [
  {
    id: "4",
    user: "Emily Davis",
    book: "Sapiens",
    reserveDate: "2023-10-25",
    availableDate: "2023-11-05",
    status: "pending",
  },
  {
    id: "5",
    user: "Michael Brown",
    book: "To Kill a Mockingbird",
    reserveDate: "2023-10-22",
    availableDate: "2023-11-10",
    status: "pending",
  },
]

const historyTransactions = [
  {
    id: "6",
    user: "Sarah Williams",
    book: "The Great Gatsby",
    borrowDate: "2023-08-10",
    returnDate: "2023-09-10",
    status: "returned",
  },
  {
    id: "7",
    user: "David Miller",
    book: "Pride and Prejudice",
    borrowDate: "2023-07-05",
    returnDate: "2023-08-05",
    status: "returned",
  },
  {
    id: "8",
    user: "Jennifer Wilson",
    book: "The Alchemist",
    borrowDate: "2023-09-01",
    returnDate: "2023-10-01",
    status: "returned",
  },
]

export default function AdminTransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAdmin={true} />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search transactions..." className="w-full pl-8" />
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.user}</TableCell>
                      <TableCell>{transaction.book}</TableCell>
                      <TableCell>{transaction.borrowDate}</TableCell>
                      <TableCell>{transaction.dueDate}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "active"
                              ? "bg-[#77ff9d]/20 text-[#009a2b]"
                              : "bg-[#ff8181]/20 text-[#c22424]"
                          }`}
                        >
                          {transaction.status === "active" ? "Active" : "Overdue"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Mark Returned
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="reservations">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Reserve Date</TableHead>
                    <TableHead>Available Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.user}</TableCell>
                      <TableCell>{reservation.book}</TableCell>
                      <TableCell>{reservation.reserveDate}</TableCell>
                      <TableCell>{reservation.availableDate}</TableCell>
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
                    <TableHead>User</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.user}</TableCell>
                      <TableCell>{transaction.book}</TableCell>
                      <TableCell>{transaction.borrowDate}</TableCell>
                      <TableCell>{transaction.returnDate}</TableCell>
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

