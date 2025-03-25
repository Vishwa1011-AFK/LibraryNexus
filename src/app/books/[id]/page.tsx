import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { UserInfoHeader } from "@/components/user-info-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Globe, Calendar, BookMarked } from "lucide-react"

// This would normally come from a database
const book = {
  id: "1",
  title: "The Master Algorithm",
  author: "Pedro Domingos",
  description:
    "Machine learning is the automation of discovery,the scientific method on steroids,that enables intelligent robots and computers to program themselves. No field of science today is more important yet more shrouded in mystery. Pedro Domingos, one of the field's leading lights, lifts the veil for the first time to give us a peek inside the learning machines that power Google, Amazon, and your smartphone",
  shelf: "Shelf 3A Book 22",
  isbn: "12343278",
  pages: 352,
  language: "English",
  coverUrl: "/placeholder.svg?height=400&width=260",
  category: "Computer Science",
  publishDate: "September 22, 2015",
  publisher: "Basic Books",
}

// User data would come from auth context
const userData = {
  name: "Diwakar Dubey",
  email: "dd34@gmail.com",
}

export default function BookDetail({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <UserInfoHeader name={userData.name} email={userData.email} />

          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-6">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  <BookMarked className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Link href="/library">
                  <Button variant="outline" className="border-primary text-primary w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Go to Library
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{book.category}</Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    ISBN: {book.isbn}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
                <p className="text-muted-foreground mb-2">
                  by <span className="text-primary">{book.author}</span>
                </p>
                <p className="text-lg font-medium text-amber-500 mb-4">{book.shelf}</p>
              </div>

              <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
                <p className="text-muted-foreground">{book.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <BookOpen className="h-6 w-6 text-primary mb-2" />
                    <div className="text-lg font-bold">{book.pages}</div>
                    <div className="text-xs text-muted-foreground">Pages</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Globe className="h-6 w-6 text-primary mb-2" />
                    <div className="text-lg font-bold">{book.language}</div>
                    <div className="text-xs text-muted-foreground">Language</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-6 w-6 text-primary mb-2" />
                    <div className="text-lg font-bold">{book.publishDate.split(",")[0]}</div>
                    <div className="text-xs text-muted-foreground">Published</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <BookMarked className="h-6 w-6 text-primary mb-2" />
                    <div className="text-lg font-bold">{book.publisher}</div>
                    <div className="text-xs text-muted-foreground">Publisher</div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-xl font-bold mb-4">Book Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Title</dt>
                    <dd className="text-foreground">{book.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Author</dt>
                    <dd className="text-foreground">{book.author}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">ISBN</dt>
                    <dd className="text-foreground">{book.isbn}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Publisher</dt>
                    <dd className="text-foreground">{book.publisher}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Publication Date</dt>
                    <dd className="text-foreground">{book.publishDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Language</dt>
                    <dd className="text-foreground">{book.language}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Pages</dt>
                    <dd className="text-foreground">{book.pages}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="text-foreground">{book.shelf}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

