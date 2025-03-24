import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, ArrowUpRight } from "lucide-react"

// Sample borrowed books data
const borrowedBooks = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverUrl: "/placeholder.svg?height=120&width=80",
    borrowedDate: "2023-03-15",
    dueDate: "2023-04-15",
    progress: 65,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "/placeholder.svg?height=120&width=80",
    borrowedDate: "2023-03-10",
    dueDate: "2023-04-10",
    progress: 30,
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "/placeholder.svg?height=120&width=80",
    borrowedDate: "2023-03-20",
    dueDate: "2023-04-20",
    progress: 15,
  },
]

// Sample reading history
const readingHistory = [
  {
    id: 4,
    title: "The Four Winds",
    author: "Kristin Hannah",
    coverUrl: "/placeholder.svg?height=120&width=80",
    completedDate: "2023-02-28",
  },
  {
    id: 5,
    title: "The Vanishing Half",
    author: "Brit Bennett",
    coverUrl: "/placeholder.svg?height=120&width=80",
    completedDate: "2023-02-15",
  },
  {
    id: 6,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    coverUrl: "/placeholder.svg?height=120&width=80",
    completedDate: "2023-01-30",
  },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Manage your borrowed books and reading activity</p>
            </div>
            <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
              Browse Library
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Currently Reading</CardTitle>
                <CardDescription>Books in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{borrowedBooks.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Books Completed</CardTitle>
                <CardDescription>This year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{readingHistory.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Reading Time</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24h 30m</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="borrowed" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
              <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            <TabsContent value="borrowed" className="pt-4">
              <div className="rounded-md border bg-card">
                <div className="p-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 font-medium border-b">
                  <div>Book</div>
                  <div>Progress</div>
                  <div>Due Date</div>
                </div>
                {borrowedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        width={50}
                        height={75}
                        className="rounded-sm"
                      />
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                    </div>
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{book.progress}% complete</span>
                        <span>{book.progress < 100 ? `${100 - book.progress}% remaining` : "Completed"}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {book.dueDate}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history" className="pt-4">
              <div className="rounded-md border bg-card">
                <div className="p-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 font-medium border-b">
                  <div>Book</div>
                  <div>Status</div>
                  <div>Completed</div>
                </div>
                {readingHistory.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        width={50}
                        height={75}
                        className="rounded-sm"
                      />
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-success text-success-foreground">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-secondary">
                        {book.completedDate}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="saved" className="pt-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved books yet</h3>
                <p className="text-muted-foreground mb-4">Books you save will appear here for easy access.</p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Browse Library</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

