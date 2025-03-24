import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Edit, Trash } from "lucide-react"

// Sample user data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Member",
    status: "active",
    joinDate: "2023-01-15",
    booksCheckedOut: 2,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Member",
    status: "active",
    joinDate: "2023-02-20",
    booksCheckedOut: 1,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2022-11-05",
    booksCheckedOut: 0,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Member",
    status: "inactive",
    joinDate: "2023-03-10",
    booksCheckedOut: 0,
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Member",
    status: "active",
    joinDate: "2023-04-25",
    booksCheckedOut: 3,
  },
]

export default function AdminUsersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAdmin={true} />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <div className="flex gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users..." className="w-full pl-8" />
            </div>
            <Button className="bg-primary text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Books Checked Out</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active" ? "bg-[#77ff9d]/20 text-[#009a2b]" : "bg-[#e1e1e1]/20 text-[#9a9a9a]"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.booksCheckedOut}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

