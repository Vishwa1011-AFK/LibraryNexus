import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

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
}

export default function BookDetail({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 border-b border-muted pb-4">
            <div>
              <span className="text-lg">Name</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">Diwakar Dubey</span>
            </div>
            <div>
              <span className="text-lg">Email ID</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">dd34@gmail.com</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-4">
              <Image
                src={book.coverUrl || "/placeholder.svg"}
                alt={book.title}
                width={300}
                height={450}
                className="w-full"
              />
              <div className="flex flex-col gap-2">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  Add to Wishlist
                </Button>
                <Link href="/library">
                  <Button variant="outline" className="border-primary text-primary w-full">
                    Go to Library
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              <p className="text-muted-foreground mb-4">by {book.author}</p>

              <h2 className="text-2xl font-bold mb-6">{book.shelf}</h2>

              <p className="text-muted-foreground mb-8">{book.description}</p>

              <div className="flex gap-8">
                <div className="bg-card rounded-md p-4 flex items-center justify-center flex-col">
                  <div className="text-2xl font-bold">01</div>
                  <div className="text-xs text-muted-foreground">352 Pages</div>
                </div>

                <div className="bg-card rounded-md p-4 flex items-center justify-center flex-col">
                  <div className="text-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-globe"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" x2="22" y1="12" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-foreground">English</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

