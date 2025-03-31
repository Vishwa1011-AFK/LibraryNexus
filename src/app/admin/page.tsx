// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Users,
  Plus,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  Filter,
  Library,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    type Book,
    type BooksApiResponse,
    type AdminStats,
} from "@/types";

interface AdminBook extends Book {
    totalCopies?: number;
    availableCopies?: number;
    status?: "Available" | "Unavailable" | string;
    added?: string | Date;
    borrows?: number;
}

interface AdminBooksApiResponse extends BooksApiResponse {
    books: AdminBook[];
}

type SortField = 'title' | 'author' | 'isbn' | 'category' | 'addedDate';
type SortDirection = 'asc' | 'desc';
type AdminSortOption = `${SortField}_${SortDirection}`;
type StatusOption = 'all' | 'available' | 'unavailable';
type FeaturedOption = 'all' | 'true' | 'false';

const ADMIN_SORT_OPTIONS: { value: AdminSortOption | 'default', label: string }[] = [
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'author_asc', label: 'Author (A-Z)' },
    { value: 'author_desc', label: 'Author (Z-A)' },
    { value: 'addedDate_desc', label: 'Added Date (Newest)' },
    { value: 'addedDate_asc', label: 'Added Date (Oldest)' },
];

export default function AdminDashboard() {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [books, setBooks] = useState<AdminBook[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<AdminSortOption | 'default'>('title_asc');
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>('all');
    const [selectedFeatured, setSelectedFeatured] = useState<FeaturedOption>('all');

    const [tempCategory, setTempCategory] = useState<string>('all');
    const [tempStatus, setTempStatus] = useState<StatusOption>('all');
    const [tempFeatured, setTempFeatured] = useState<FeaturedOption>('all');

    const buildBookQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('limit', '15');
        if (searchTerm) params.set('search', searchTerm);
        if (sortBy !== 'default' && sortBy !== 'title_asc') {
             params.set('sortBy', sortBy);
        }
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (selectedStatus !== 'all') params.set('status', selectedStatus);
        if (selectedFeatured !== 'all') params.set('featured', selectedFeatured);

        return params.toString();
    }, [searchTerm, sortBy, selectedCategory, selectedStatus, selectedFeatured]);


    const fetchBooks = useCallback(async () => {
        setIsLoadingBooks(true);
        const queryString = buildBookQueryParams();
        try {
            const data = await apiClient<AdminBooksApiResponse>(`/admin/books?${queryString}`);
            setBooks(data.books || []);
        } catch (error: any) {
            console.error("Error fetching books:", error);
            toast({ title: "Error Loading Books", description: error.message || "Could not load book list.", variant: "destructive" });
            setBooks([]);
        } finally {
            setIsLoadingBooks(false);
        }
    }, [toast, buildBookQueryParams]);


    useEffect(() => {
        const fetchStats = async () => {
            setIsLoadingStats(true);
            try {
                const data = await apiClient<AdminStats>('/admin/dashboard-stats');
                setStats(data);
            } catch (error: any) {
                console.error("Error fetching stats:", error);
                toast({ title: "Error Loading Stats", description: error.message || "Could not load dashboard statistics.", variant: "destructive" });
                setStats(null);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, [toast]);


     useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const cats = await apiClient<string[]>('/categories');
                setCategories(cats || []);
            } catch (error: any) {
                 console.error("Error fetching categories:", error);
                 toast({ title: "Error Loading Categories", description: error.message || "Could not load categories.", variant: "destructive" });
            } finally {
                 setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [toast]);


     const handleDeleteBook = async (bookId: string, bookTitle: string) => {
         if (!confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
             return;
         }
         setIsLoadingBooks(true);
         try {
             await apiClient(`/admin/books/${bookId}`, 'DELETE');
             toast({ title: "Success", description: `Book "${bookTitle}" deleted successfully.` });
             fetchBooks();
             const fetchStats = async () => {
                 try { const data = await apiClient<AdminStats>('/admin/dashboard-stats'); setStats(data); } catch { /* ignore */ }
             };
             fetchStats();
         } catch (error: any) {
             toast({ title: "Deletion Failed", description: error.message || "Could not delete book.", variant: "destructive" });
             setIsLoadingBooks(false);
         }
     };

    const handleSortChange = (value: string) => {
        setSortBy(value as AdminSortOption | 'default');
    };

    const handleApplyFilters = () => {
        setSelectedCategory(tempCategory);
        setSelectedStatus(tempStatus);
        setSelectedFeatured(tempFeatured);
        setIsFilterSheetOpen(false);
    };

    const handleClearFilters = () => {
        setTempCategory('all');
        setTempStatus('all');
        setTempFeatured('all');
        setSelectedCategory('all');
        setSelectedStatus('all');
        setSelectedFeatured('all');
        setIsFilterSheetOpen(false);
    };

     useEffect(() => {
         if (isFilterSheetOpen) {
             setTempCategory(selectedCategory);
             setTempStatus(selectedStatus);
             setTempFeatured(selectedFeatured);
         }
     }, [isFilterSheetOpen, selectedCategory, selectedStatus, selectedFeatured]);


    return (
         <ProtectedRoute adminOnly={true}>
             <div className="flex min-h-screen flex-col">
                 <SiteHeader />
                 <div className="flex flex-1">
                    <aside className="w-64 border-r border-border hidden md:block flex-shrink-0">
                         <div className="p-4 sticky top-16">
                             <h2 className="font-semibold mb-4">Admin Panel</h2>
                             <nav className="space-y-1">
                                <Link href="/admin" className={cn("flex items-center gap-2 px-3 py-2 rounded-md", pathname === '/admin' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                                <BookOpen className="h-4 w-4" />
                                    <span>Books</span>
                                </Link>
                                <Link href="/admin/users" className={cn("flex items-center gap-2 px-3 py-2 rounded-md", pathname === '/admin/users' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                                    <Users className="h-4 w-4" />
                                    <span>Users</span>
                                </Link>
                                <Link href="/admin/loans" className={cn("flex items-center gap-2 px-3 py-2 rounded-md", pathname === '/admin/loans' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                                  <Library className="h-4 w-4" /> 
                                  <span>Loans</span>
                                </Link>
                             </nav>
                         </div>
                     </aside>

                     <main className="flex-1 p-4 md:p-6 overflow-x-auto">
                         <div className="max-w-7xl mx-auto">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                 <div>
                                     <h1 className="text-3xl font-bold mb-2">Books Management</h1>
                                     <p className="text-muted-foreground">Manage your library's book collection</p>
                                 </div>
                                 <Link href="/admin/books/new" passHref>
                                     <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                         <Plus className="h-4 w-4 mr-2" />
                                         Add New Book
                                     </Button>
                                 </Link>
                             </div>

                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                                {isLoadingStats ? (
                                    <>
                                        {[...Array(4)].map((_, i) => (
                                            <Card key={i} className="bg-card">
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <Skeleton className="h-5 w-3/4" />
                                                     <Skeleton className="h-4 w-4"/>
                                                </CardHeader>
                                                <CardContent>
                                                    <Skeleton className="h-8 w-1/2" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </>
                                ) : stats ? (
                                    <>
                                         <Card className="bg-card">
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                                                <BookOpen className="h-4 w-4 text-muted-foreground"/>
                                             </CardHeader>
                                             <CardContent>
                                                <div className="text-2xl font-bold">{stats.totalBooks ?? 0}</div>
                                             </CardContent>
                                         </Card>
                                         <Card className="bg-card">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Active Borrows</CardTitle>
                                                <Users className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                             <CardContent>
                                                <div className="text-2xl font-bold">{stats.activeBorrows ?? 0}</div>
                                             </CardContent>
                                         </Card>
                                         <Card className="bg-card">
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                                                <Trash className="h-4 w-4 text-muted-foreground"/>
                                             </CardHeader>
                                             <CardContent>
                                                <div className={`text-2xl font-bold ${(stats.overdue ?? 0) > 0 ? 'text-destructive' : ''}`}>{stats.overdue ?? 0}</div>
                                             </CardContent>
                                         </Card>
                                         <Card className="bg-card">
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                                                <Plus className="h-4 w-4 text-muted-foreground"/>
                                            </CardHeader>
                                             <CardContent>
                                                <div className="text-2xl font-bold">{stats.newThisMonth ?? 0}</div>
                                             </CardContent>
                                         </Card>
                                    </>
                                ) : (
                                    <p className="text-destructive md:col-span-4 text-center py-4">Could not load stats.</p>
                                )}
                            </div>

                             <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                 <div className="relative w-full md:max-w-sm">
                                     <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                     <Input
                                        type="search"
                                        placeholder="Search books..."
                                        className="w-full bg-background pl-8 rounded-md border-input"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') fetchBooks(); }}
                                     />
                                 </div>
                                 <div className="flex gap-2 w-full md:w-auto">
                                      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                                                <Filter className="h-4 w-4 mr-2" /> Filter
                                                 { (selectedCategory !== 'all' || selectedStatus !== 'all' || selectedFeatured !== 'all') && <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span> }
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                            <SheetTitle>Filter Books</SheetTitle>
                                            <SheetDescription>
                                                Apply filters to narrow down the book list.
                                            </SheetDescription>
                                            </SheetHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="filter-category" className="text-right">Category</Label>
                                                    <Select value={tempCategory} onValueChange={setTempCategory} disabled={isLoadingCategories}>
                                                        <SelectTrigger id="filter-category" className="col-span-3">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Categories</SelectItem>
                                                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="filter-status" className="text-right">Status</Label>
                                                    <Select value={tempStatus} onValueChange={(v) => setTempStatus(v as StatusOption)}>
                                                        <SelectTrigger id="filter-status" className="col-span-3">
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Statuses</SelectItem>
                                                            <SelectItem value="available">Available</SelectItem>
                                                            <SelectItem value="unavailable">Unavailable</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="filter-featured" className="text-right">Featured</Label>
                                                     <Select value={tempFeatured} onValueChange={(v) => setTempFeatured(v as FeaturedOption)}>
                                                        <SelectTrigger id="filter-featured" className="col-span-3">
                                                            <SelectValue placeholder="Select Featured Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All</SelectItem>
                                                            <SelectItem value="true">Yes</SelectItem>
                                                            <SelectItem value="false">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                                                <SheetClose asChild>
                                                     <Button onClick={handleApplyFilters}>Apply Filters</Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                      </Sheet>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1 md:flex-none w-[130px] justify-between">
                                                <span>Sort By</span> <ArrowUpDown className="h-4 w-4 ml-2 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
                                                {ADMIN_SORT_OPTIONS.map((option) => (
                                                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                             </div>

                             <div className="rounded-md border bg-card overflow-hidden">
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px] px-2 hidden sm:table-cell">Cover</TableHead>
                                            <TableHead>Title / Author</TableHead>
                                            <TableHead className="hidden lg:table-cell">ISBN</TableHead>
                                            <TableHead className="hidden md:table-cell">Category</TableHead>
                                            <TableHead className="text-center">Stock</TableHead>
                                            <TableHead className="text-center hidden sm:table-cell">Status</TableHead>
                                            <TableHead className="text-right pr-2">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingBooks ? (
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <TableRow key={`skel-${i}`}>
                                                    <TableCell className="px-2 hidden sm:table-cell"><Skeleton className="h-[60px] w-[40px] rounded-sm" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-3/4 mb-1" /><Skeleton className="h-3 w-1/2" /></TableCell>
                                                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
                                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                                                    <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                                    <TableCell className="text-center hidden sm:table-cell"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                                                    <TableCell className="text-right pr-2"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : books.length === 0 ? (
                                             <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24">
                                                    {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedFeatured !== 'all' ? `No books found matching the current criteria.` : "No books found. Add one!"}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            books.map((book) => (
                                                <TableRow key={book.id}>
                                                     <TableCell className="px-2 hidden sm:table-cell">
                                                         <Image
                                                            src={book.coverUrl || book.cover || "/placeholder.svg"}
                                                            alt={book.title}
                                                            width={40}
                                                            height={60}
                                                            className="rounded-sm object-cover aspect-[2/3]"
                                                            unoptimized
                                                         />
                                                    </TableCell>
                                                    <TableCell className="py-2 max-w-[250px] xl:max-w-xs">
                                                        <Link href={`/admin/books/${book.id}`} className="font-medium hover:underline line-clamp-2" title={book.title}>{book.title}</Link>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{book.isbn}</TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                         {book.category && <Badge variant="secondary" className="whitespace-nowrap text-xs">{book.category}</Badge>}
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs">
                                                         {book.availableCopies ?? 'N/A'} / {book.totalCopies ?? 'N/A'}
                                                    </TableCell>
                                                     <TableCell className="text-center hidden sm:table-cell">
                                                        {book.status && (
                                                            <Badge
                                                                variant={book.status === "Available" ? "success" : "destructive"}
                                                                className="text-xs"
                                                             >
                                                                 {book.status}
                                                             </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-2">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                 <DropdownMenuItem asChild><Link href={`/admin/books/${book.id}`}><Search className="mr-2 h-4 w-4"/> View</Link></DropdownMenuItem>
                                                                <DropdownMenuItem asChild><Link href={`/admin/books/${book.id}/edit`}><Edit className="mr-2 h-4 w-4"/> Edit</Link></DropdownMenuItem>
                                                                <DropdownMenuItem asChild><Link href={`/admin/issue?bookId=${book.id}&title=${encodeURIComponent(book.title)}&isbn=${book.isbn}`}><BookOpen className="mr-2 h-4 w-4"/> Issue</Link></DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeleteBook(book.id, book.title)}>
                                                                    <Trash className="mr-2 h-4 w-4"/> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                 </Table>
                             </div>
                         </div>
                     </main>
                 </div>
             </div>
         </ProtectedRoute>
    );
}