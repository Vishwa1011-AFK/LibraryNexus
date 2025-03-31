"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { UserInfoHeader } from "@/components/user-info-header";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Sparkles, Library as LibraryIcon, TrendingUp } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { apiClient } from "@/lib/api";
import { type Book, type BooksApiResponse } from "@/types";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const SectionTitle = ({ title, icon, onViewAllLink }: { title: string; icon?: React.ReactNode, onViewAllLink?: string }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            {icon} {title}
        </h2>
        {onViewAllLink && (
            <Link href={onViewAllLink} passHref>
                 <Button variant="outline" size="sm">View All</Button>
            </Link>
        )}
    </div>
);

const BookSection = ({ books, isLoading }: { books: Book[]; isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="flex space-x-4 overflow-x-auto pb-4 -ml-4 pl-4">
                {Array.from({ length: 5 }).map((_, index) => (
                     <div key={index} className="w-36 md:w-40 flex-shrink-0 space-y-2">
                         <Skeleton className="aspect-[2/3] w-full rounded-md" />
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-4 w-1/2" />
                     </div>
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return <p className="text-muted-foreground text-sm">No books found for this section.</p>;
    }

    return (
         <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4">
                {books.map((book) => (
                    <CarouselItem key={book.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                         <BookCard
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            coverUrl={book.coverUrl || book.cover || "/placeholder.svg"}
                            category={book.category}
                            available={book.available}
                            className="h-full"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        </Carousel>
    );
};

export default function LibraryPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
    const [newBooks, setNewBooks] = useState<Book[]>([]);
    const [popularBooks, setPopularBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [loadingNew, setLoadingNew] = useState(true);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [discoverySearch, setDiscoverySearch] = useState("");

    const fetchSection = useCallback(async (
        endpoint: string,
        setter: React.Dispatch<React.SetStateAction<Book[]>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setLoading(true);
        try {
            const data = await apiClient<BooksApiResponse>(endpoint);
            setter(data.books || []);
        } catch (err: any) {
            console.error(`Failed to fetch ${endpoint}:`, err);
            setter([]); 
        } finally {
            setLoading(false);
        }
    }, [toast]); 

    const fetchCategoriesData = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const cats = await apiClient<string[]>('/categories');
            setCategories(cats || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
        } finally {
            setLoadingCategories(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchSection('/books?featured=true&limit=10', setFeaturedBooks, setLoadingFeatured);
        fetchSection('/books?sortBy=newest&limit=10', setNewBooks, setLoadingNew);
        setLoadingPopular(false); 
        fetchCategoriesData();
    }, [fetchSection, fetchCategoriesData]);

    const handleDiscoverySearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(discoverySearch.trim()){
            router.push(`/books?search=${encodeURIComponent(discoverySearch)}`);
        }
    };

    if (authLoading) return <div className="flex min-h-screen flex-col"><SiteHeader /><main className="flex-1 flex items-center justify-center">Loading User...</main></div>;

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {user && <UserInfoHeader name={`${user.firstName} ${user.lastName}`} email={user.email} isAdmin={user?.isAdmin} />}

                    <form onSubmit={handleDiscoverySearch} className="mb-12 mt-6 max-w-lg mx-auto">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Quick search... (Press Enter to go to catalog)"
                                className="pl-10"
                                value={discoverySearch}
                                onChange={(e) => setDiscoverySearch(e.target.value)}
                            />
                         </div>
                    </form>

                    <section className="mb-12">
                        <SectionTitle title="Featured Books" icon={<Star className="h-6 w-6 text-yellow-500" />} onViewAllLink="/books?featured=true" />
                        <BookSection books={featuredBooks} isLoading={loadingFeatured} />
                    </section>

                    <section className="mb-12">
                        <SectionTitle title="New Arrivals" icon={<Sparkles className="h-6 w-6 text-blue-500" />} onViewAllLink="/books?sortBy=newest" />
                        <BookSection books={newBooks} isLoading={loadingNew} />
                    </section>

                    {!loadingPopular && popularBooks.length > 0 && (
                        <section className="mb-12">
                            <SectionTitle title="Popular This Week" icon={<TrendingUp className="h-6 w-6 text-green-500" />} onViewAllLink="/books?sortBy=popularity" />
                            <BookSection books={popularBooks} isLoading={loadingPopular} />
                        </section>
                    )}

                    <section className="mb-12">
                        <SectionTitle title="Browse by Genre" icon={<LibraryIcon className="h-6 w-6 text-purple-500" />} />
                        {loadingCategories ? (
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-20 rounded-full" />
                                <Skeleton className="h-8 w-28 rounded-full" />
                                <Skeleton className="h-8 w-16 rounded-full" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        ) : categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(0, 15).map((cat) => ( 
                                    <Link key={cat} href={`/books?category=${encodeURIComponent(cat)}`} passHref>
                                        <Badge variant="secondary" className="px-3 py-1 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 transition-colors">
                                            {cat}
                                        </Badge>
                                    </Link>
                                ))}
                                 <Link href="/books" passHref>
                                    <Badge variant="outline" className="px-3 py-1 text-sm cursor-pointer hover:bg-accent">
                                        View All Categories
                                    </Badge>
                                </Link>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">No categories found.</p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}