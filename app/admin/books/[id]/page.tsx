import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Star, Share2, Edit, Trash } from "lucide-react"

export default function AdminBookDetailPage({ params }: { params: { id: string } }) {
  // This would normally fetch the book data based on the ID
  const book = {
    id: params.id,
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverUrl: "/placeholder.svg?height=400&width=260",
    status: "available",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined. Santiago's journey teaches us about the essential wisdom of listening to our hearts, of recognizing opportunity and learning to read the omens strewn along life's path, and, most importantly, to follow our dreams.",
    publishedDate: "1988",
    pages: 197,
    genre: "Fiction, Philosophy",
    rating: 4.5,
    isbn: "978-0062315007",
    publisher: "HarperOne",
    language: "English",
    copies: 5,
    availableCopies: 3,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAdmin={true} />
      <main className="flex-1 container py-8">
        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          <div>
            <div className="book-cover h-[400px] w-[260px]">
              <img src={book.coverUrl || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Button className="w-full bg-primary text-primary-foreground">
                <Edit className="mr-2 h-4 w-4" />
                Edit Book
              </Button>
              <Button variant="outline" className="w-full text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Book
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <p className="text-xl text-muted-foreground">{book.author}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-6 pt-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Published {book.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>{book.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${book.status === "available" ? "bg-[#77ff9d]" : book.status === "borrowed" ? "bg-[#ff4d4d]" : "bg-[#d97921]"}`}
                    />
                    <span className="capitalize">{book.status}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">{book.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Book Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Genre</p>
                      <p className="text-muted-foreground">{book.genre}</p>
                    </div>
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-muted-foreground">{book.language}</p>
                    </div>
                    <div>
                      <p className="font-medium">ISBN</p>
                      <p className="text-muted-foreground">{book.isbn}</p>
                    </div>
                    <div>
                      <p className="font-medium">Publisher</p>
                      <p className="text-muted-foreground">{book.publisher}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Copies</p>
                      <p className="text-muted-foreground">{book.copies}</p>
                    </div>
                    <div>
                      <p className="font-medium">Available Copies</p>
                      <p className="text-muted-foreground">{book.availableCopies}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="transactions" className="pt-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-3 text-left font-medium">User</th>
                        <th className="p-3 text-left font-medium">Borrow Date</th>
                        <th className="p-3 text-left font-medium">Due Date</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">John Doe</td>
                        <td className="p-3">2023-10-15</td>
                        <td className="p-3">2023-11-15</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#77ff9d]/20 text-[#009a2b]">Active</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">
                            Mark Returned
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Jane Smith</td>
                        <td className="p-3">2023-09-20</td>
                        <td className="p-3">2023-10-20</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#ff8181]/20 text-[#c22424]">Overdue</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">
                            Mark Returned
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="history" className="pt-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-3 text-left font-medium">User</th>
                        <th className="p-3 text-left font-medium">Borrow Date</th>
                        <th className="p-3 text-left font-medium">Return Date</th>
                        <th className="p-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Michael Johnson</td>
                        <td className="p-3">2023-08-10</td>
                        <td className="p-3">2023-09-10</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#e1e1e1]/20 text-[#9a9a9a]">
                            Returned
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Sarah Williams</td>
                        <td className="p-3">2023-07-05</td>
                        <td className="p-3">2023-08-05</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#e1e1e1]/20 text-[#9a9a9a]">
                            Returned
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

