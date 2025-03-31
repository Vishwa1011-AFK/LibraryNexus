"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { type User, type Book, type ApiResponseWithMessage } from "@/types";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { cn } from "@/lib/utils";
import { Search, Library, ArrowLeft, BookOpen, Users, Undo2, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminLoan {
  id: string;
  _id?: string;
  user: { _id: string; name: string; email: string; } | null;
  book: { _id: string; title: string; author: string; isbn: string; } | null;
  issueDate: string | Date;
  returnDate: string | Date;
  actualReturnDate?: string | Date;
  returned: boolean;
  status: 'Issued' | 'Overdue' | 'Returned';
}

interface AdminLoansApiResponse {
  loans: AdminLoan[];
  total: number;
  page: number;
  totalPages: number;
}

type LoanStatusFilter = 'all' | 'active' | 'overdue' | 'returned';

export default function AdminLoansPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [loans, setLoans] = useState<AdminLoan[]>([]);
    const [isLoadingLoans, setIsLoadingLoans] = useState(true);
    const [errorLoans, setErrorLoans] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = useState(1);
    const [totalLoansCount, setTotalLoansCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [statusFilter, setStatusFilter] = useState<LoanStatusFilter>(searchParams.get('status') as LoanStatusFilter || 'all');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'issueDate_desc');

    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '15');
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (searchQuery) params.set('search', searchQuery);
        if (sortBy) params.set('sortBy', sortBy);
        return params.toString();
    }, [currentPage, statusFilter, searchQuery, sortBy]);

    const fetchLoans = useCallback(async () => {
        setIsLoadingLoans(true);
        setErrorLoans(null);
        const queryString = buildQueryParams();

        try {
            const data = await apiClient<AdminLoansApiResponse>(`/admin/loans?${queryString}`);
            setLoans(data.loans || []);
            setTotalPages(data.totalPages || 1);
            setTotalLoansCount(data.total || 0);
            setCurrentPage(prevPage => Math.max(1, Math.min(prevPage, data.totalPages || 1)));

            router.replace(`${pathname}?${queryString}`, { scroll: false });
        } catch (err: any) {
            setErrorLoans(err.message || "Failed to load loans.");
            toast({ title: "Error Loading Loans", description: err.message, variant: "destructive" });
            setLoans([]);
            setTotalPages(1);
            setTotalLoansCount(0);
        } finally {
            setIsLoadingLoans(false);
        }
    }, [buildQueryParams, toast, router, pathname]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans, currentPage]);

     useEffect(() => {
         setCurrentPage(1);
         fetchLoans();
     }, [statusFilter, sortBy, searchQuery]);


    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleActionLoading = (loanId: string, isLoading: boolean) => {
        setActionLoading(prev => ({ ...prev, [loanId]: isLoading }));
    };

    const handleReturnLoan = async (loanId: string) => {
        handleActionLoading(loanId, true);
        try {
            const response = await apiClient<ApiResponseWithMessage>(`/admin/loans/return/${loanId}`, 'POST', {});
            toast({ title: "Success", description: response.message || `Loan marked as returned.` });
            fetchLoans();
        } catch (err: any) {
             toast({ title: "Error Returning Book", description: err.message, variant: "destructive" });
        } finally {
             handleActionLoading(loanId, false);
        }
    };

    const handleRenewLoan = async (loanId: string) => {
        handleActionLoading(loanId, true);
        try {
            const response = await apiClient<ApiResponseWithMessage>(`/admin/loans/renew/${loanId}`, 'POST', {});
            toast({ title: "Success", description: response.message || `Loan renewed.` });
            fetchLoans();
        } catch (err: any) {
             toast({ title: "Error Renewing Loan", description: err.message, variant: "destructive" });
        } finally {
             handleActionLoading(loanId, false);
        }
    };


     const formatDate = (dateInput: string | Date | undefined): string => {
          if (!dateInput) return 'N/A';
         try {
             return format(new Date(dateInput), 'PP');
         } catch { return 'Invalid Date'; }
     };

     const renderPaginationItems = () => {
         const items = [];
         const maxPagesToShow = 5;
         let startPage = Math.max(1, currentPage - 2);
         let endPage = Math.min(totalPages, currentPage + 2);

         if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; }
         else if (currentPage <= 3) { endPage = maxPagesToShow; }
         else if (currentPage + 2 >= totalPages) { startPage = totalPages - maxPagesToShow + 1; }


         if (startPage > 1) {
             items.push(<PaginationItem key={1}><PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink></PaginationItem>);
             if (startPage > 2) { items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>); }
         }

         for (let i = startPage; i <= endPage; i++) {
             items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>{i}</PaginationLink></PaginationItem>);
         }

         if (endPage < totalPages) {
             if (endPage < totalPages - 1) { items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>); }
             items.push(<PaginationItem key={totalPages}><PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink></PaginationItem>);
         }
         return items;
     };


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
                         <div className="container mx-auto max-w-7xl">
                             <h1 className="text-3xl font-bold mb-6">Loan Management</h1>

                             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                                 <div className="w-full sm:w-auto">
                                     <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LoanStatusFilter)}>
                                         <SelectTrigger className="w-full sm:w-[180px]">
                                             <SelectValue placeholder="Filter by status" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="all">All Statuses</SelectItem>
                                             <SelectItem value="active">Active</SelectItem>
                                             <SelectItem value="overdue">Overdue</SelectItem>
                                             <SelectItem value="returned">Returned</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>
                             </div>

                             <div className="rounded-md border">
                                 {isLoadingLoans ? (
                                     <div className="space-y-1 p-4">
                                         {Array.from({ length: 10 }).map((_, i) => ( <Skeleton key={i} className="h-12 w-full" /> ))}
                                     </div>
                                 ) : errorLoans ? (
                                    <p className="text-center text-destructive py-10">{errorLoans}</p>
                                 ) : loans.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Book</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead className="hidden md:table-cell">Issued</TableHead>
                                                <TableHead className="hidden lg:table-cell">Due</TableHead>
                                                <TableHead className="hidden xl:table-cell">Returned On</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loans.map((loan) => (
                                                <TableRow key={loan.id}>
                                                    <TableCell className="max-w-[200px]">
                                                        <Link href={`/admin/books/${loan.book?._id}`} className="font-medium hover:underline line-clamp-1" title={loan.book?.title}>
                                                           {loan.book?.title || 'N/A'}
                                                         </Link>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{loan.book?.author || 'N/A'}</p>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px]">
                                                         <Link href={`/admin/users/${loan.user?._id}/edit`} className="font-medium hover:underline line-clamp-1" title={loan.user?.email}>
                                                             {loan.user?.name || 'N/A'}
                                                         </Link>
                                                         <p className="text-xs text-muted-foreground line-clamp-1">{loan.user?.email || 'N/A'}</p>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-xs">{formatDate(loan.issueDate)}</TableCell>
                                                    <TableCell className="hidden lg:table-cell text-xs">{formatDate(loan.returnDate)}</TableCell>
                                                    <TableCell className="hidden xl:table-cell text-xs">{loan.returned ? formatDate(loan.actualReturnDate) : '-'}</TableCell>
                                                    <TableCell>
                                                         <Badge variant={
                                                            loan.status === 'Returned' ? 'success' :
                                                            loan.status === 'Overdue' ? 'destructive' : 'default'
                                                          } className="text-xs whitespace-nowrap">
                                                             {loan.status}
                                                          </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                                                         {!loan.returned && (
                                                            <>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={actionLoading[loan.id]}>
                                                                            <Undo2 className="mr-1 h-3 w-3" /> {actionLoading[loan.id] ? 'Returning...' : 'Return'}
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Confirm Return</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Mark loan for "{loan.book?.title}" by {loan.user?.name || loan.user?.email} as returned?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => handleReturnLoan(loan.id)}>Confirm Return</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                     <AlertDialogTrigger asChild>
                                                                         <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={actionLoading[loan.id]}>
                                                                             <RefreshCw className="mr-1 h-3 w-3" /> {actionLoading[loan.id] ? 'Renewing...' : 'Renew'}
                                                                         </Button>
                                                                     </AlertDialogTrigger>
                                                                     <AlertDialogContent>
                                                                         <AlertDialogHeader>
                                                                             <AlertDialogTitle>Confirm Renewal</AlertDialogTitle>
                                                                             <AlertDialogDescription>
                                                                                 Renew loan for "{loan.book?.title}"? This will extend the due date by 14 days from the current due date ({formatDate(loan.returnDate)}).
                                                                             </AlertDialogDescription>
                                                                         </AlertDialogHeader>
                                                                         <AlertDialogFooter>
                                                                             <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                             <AlertDialogAction onClick={() => handleRenewLoan(loan.id)}>Confirm Renewal</AlertDialogAction>
                                                                         </AlertDialogFooter>
                                                                     </AlertDialogContent>
                                                                 </AlertDialog>
                                                             </>
                                                         )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                 ) : (
                                     <p className="text-center text-muted-foreground py-10">
                                         {statusFilter !== 'all' || searchQuery ? `No loans found matching the current criteria.` : "No loans found."}
                                     </p>
                                 )}
                             </div>

                              {!isLoadingLoans && !errorLoans && totalPages > 1 && (
                                 <div className="mt-6 flex justify-center">
                                     <Pagination>
                                         <PaginationContent>
                                             <PaginationItem>
                                                 <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} aria-disabled={currentPage <= 1} className={cn("cursor-pointer", currentPage <= 1 && "pointer-events-none opacity-50")} />
                                             </PaginationItem>
                                             {renderPaginationItems()}
                                             <PaginationItem>
                                                 <PaginationNext onClick={() => handlePageChange(currentPage + 1)} aria-disabled={currentPage >= totalPages} className={cn("cursor-pointer", currentPage >= totalPages && "pointer-events-none opacity-50")} />
                                             </PaginationItem>
                                         </PaginationContent>
                                     </Pagination>
                                 </div>
                             )}
                         </div>
                     </main>
                 </div>
             </div>
         </ProtectedRoute>
    );
}