import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { FeaturedBooks } from "@/components/books/featured-books"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Unlock your next book adventure with Nexus
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Discover, borrow, and manage your reading list with our digital library system.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-primary text-primary-foreground" asChild>
                    <Link href="/books">Browse Books</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="book-cover">
                      <Image
                        src={`/placeholder.svg?height=240&width=160`}
                        alt="Book cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <FeaturedBooks />
          </div>
        </section>
      </main>
    </div>
  )
}

