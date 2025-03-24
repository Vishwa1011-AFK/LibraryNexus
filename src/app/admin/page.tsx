import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
} from "lucide-react"

// Sample books data for admin
const books = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    added: "2023-01-15",
    status: "Available",
    borrows: 24,
    coverUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    added: "2023-01-10",
    status: "Available",
    borrows: 42,
    coverUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    added: "2023-02-05",
    status: "Available",
    borrows: 18,
    coverUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Sci-Fi",
    added: "2023-02-20",
    status: "Available",
    borrows: 15,
    coverUrl: "/placeholder.svg?height=120&width=80",
  },
  {
    id: 5,
    title: "The Four Winds",
    author: "Kristin Hannah",
    category: "Historical Fiction",
    added: "2023-03-01",
    status: "Unavailable",
    borrows: 12,
    coverUrl: "/placeholder.svg?height=120&width=80",
  },
]

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
        <aside className="w-64 border-r border-border hidden md:block">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Admin Panel</h2>
            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Books</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50"
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Books Management</h1>
                <p className="text-muted-foreground">Manage your library's book collection</p>
              </div>
              <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4 mb-8">
              <Card className="bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,248</div>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Borrows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">342</div>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">24</div>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">New This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">56</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search books..." className="w-full bg-muted pl-8 rounded-md" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </div>

            <div className="rounded-md border bg-card">
              <div className="p-4 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 font-medium border-b">
                <div>Book</div>
                <div>Details</div>
                <div>Status</div>
                <div>Borrows</div>
                <div>Actions</div>
              </div>
              {books.map((book) => (
                <div
                  key={book.id}
                  className="p-4 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      width={50}
                      height={75}
                      className="rounded-sm"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-secondary">
                        {book.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Added: {book.added}</span>
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className={`${
                        book.status === "Available"
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {book.status}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <span className="font-medium">{book.borrows}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

