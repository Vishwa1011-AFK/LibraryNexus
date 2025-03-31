import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Book, BooksApiResponse } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

async function fetchFeaturedBooksDirectly(): Promise<Book[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    console.error("API URL not configured")
    return []
  }
  try {
    const response = await fetch(`${apiUrl}/books?featured=true&limit=6`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch featured books: ${response.statusText}`)
    }
    const data: BooksApiResponse = await response.json()
    return data.books || []
  } catch (error) {
    console.error("Error fetching featured books:", error)
    return []
  }
}

export default async function Home() {
  const featuredBooks: Book[] = await fetchFeaturedBooksDirectly()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex-1 flex items-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                Unlock your institute's LRC digitally with Nexus
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                Explore institute's Books, journals, and research papers from the comfort of your hostel with 24/7
                access digitally
              </p>
              <div className="pt-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-base rounded-md inline-flex items-center transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center perspective-[1500px]">
              {featuredBooks.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 relative w-full max-w-md lg:max-w-lg">
                  {featuredBooks.slice(0, 6).map((book, index) => {
                    const animationDelay = index * 100
                    
                    const rotationDegrees = index % 2 === 0 ? 
                      Math.floor(Math.random() * 2) + 1 : 
                      -1 * (Math.floor(Math.random() * 2) + 1)
                    
                    const verticalOffset = index % 3 === 0 ? "mt-2" : 
                                          index % 3 === 1 ? "mt-4" : 
                                          "mt-0"
                    
                    return (
                      <div 
                        key={book.id || index} 
                        className={`relative aspect-[2/3] rounded-lg overflow-hidden ${verticalOffset} animate-fade-in-up`}
                        style={{ 
                          animationDelay: `${animationDelay}ms`,
                          transform: `rotate(${rotationDegrees}deg)`,
                          zIndex: 10 - index
                        }}
                      >
                        <div className="w-full h-full relative group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          
                          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-all duration-500 transform group-hover:translate-y-[-3px] group-hover:rotate-[0deg]" 
                               style={{ transformStyle: 'preserve-3d' }}>
                            <Image
                              src={book.coverUrl || book.cover || "/placeholder.svg"}
                              alt={book.title || "Featured book"}
                              fill
                              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
                              className="object-cover"
                              priority={index < 3}
                            />
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <p className="text-sm font-medium line-clamp-1">{book.title}</p>
                            <p className="text-xs opacity-80 line-clamp-1">{book.author}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 relative w-full max-w-md lg:max-w-lg">
                  {Array.from({ length: 6 }).map((_, index) => {
                    const verticalOffset = index % 3 === 0 ? "mt-2" : 
                                          index % 3 === 1 ? "mt-4" : 
                                          "mt-0"
                    
                    return (
                      <Skeleton
                        key={index}
                        className={`aspect-[2/3] rounded-lg ${verticalOffset}`}
                        style={{ 
                          transform: `rotate(${index % 2 === 0 ? 1 : -1}deg)`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}