import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type Book, type BooksApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchFeaturedBooksDirectly(): Promise<Book[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        console.error("API URL not configured");
        return [];
    }
    try {
        const response = await fetch(`${apiUrl}/books?featured=true&limit=6&sortBy=newest`, {
            next: { revalidate: 3600 }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch featured books: ${response.statusText}`);
        }
        const data: BooksApiResponse = await response.json();
        return data.books || [];
    } catch (error) {
        console.error("Error fetching featured books:", error);
        return [];
    }
}

export default async function Home() {
    const featuredBooks: Book[] = await fetchFeaturedBooksDirectly();

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-12 md:py-16 lg:py-20">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                                Unlock your institute's LRC digitally with Nexus
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl">
                                Explore institute's Books, journals, and research papers from the comfort of your hostel with 24/7 access digitally
                            </p>
                            <div className="pt-4">
                                <Link href="/signup">
                                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg rounded-md inline-flex items-center">
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            {featuredBooks.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3 md:gap-4 relative animate-fade-in">
                                    {featuredBooks.map((book, index) => (
                                        <div key={book.id} className={`relative aspect-[2/3] rounded-md overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
                                            index % 3 === 0 ? "mt-4 md:mt-8" : index % 3 === 2 ? "mb-4 md:mb-8" : ""
                                        }`}>
                                            <Image
                                                src={book.coverUrl || book.cover || "/placeholder.svg"}
                                                alt={book.title}
                                                fill
                                                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 15vw, 10vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3 md:gap-4 relative">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Skeleton key={index} className={`aspect-[2/3] rounded-md ${
                                            index % 3 === 0 ? "mt-4 md:mt-8" : index % 3 === 2 ? "mb-4 md:mb-8" : ""
                                        }`} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
