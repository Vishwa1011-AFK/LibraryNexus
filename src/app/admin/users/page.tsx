"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { type User, type AdminUsersApiResponse } from "@/types";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Search, Edit, Trash, UserPlus, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
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
import { buttonVariants } from "@/components/ui/button";

export default function AdminUsersPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { user: currentAdminUser } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [errorUsers, setErrorUsers] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', '15');
        if (searchQuery) params.set('search', searchQuery);
        return params.toString();
    }, [currentPage, searchQuery]);

    const fetchUsers = useCallback(async () => {
        setIsLoadingUsers(true);
        setErrorUsers(null);
        const queryString = buildQueryParams();

        try {
            const data = await apiClient<AdminUsersApiResponse>(`/admin/users?${queryString}`);
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
            setTotalUsersCount(data.total || 0);
            setCurrentPage(prevPage => Math.max(1, Math.min(prevPage, data.totalPages || 1)));
            router.replace(`${pathname}?${queryString}`, { scroll: false });
        } catch (err: any) {
            setErrorUsers(err.message || "Failed to load users.");
            toast({ title: "Error Loading Users", description: err.message, variant: "destructive" });
            setUsers([]);
            setTotalPages(1);
            setTotalUsersCount(0);
        } finally {
            setIsLoadingUsers(false);
        }
    }, [buildQueryParams, toast, router, pathname]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, currentPage]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

     const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEditUser = (userId: string) => {
        router.push(`/admin/users/${userId}/edit`);
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (currentAdminUser && currentAdminUser.id === userId) {
            toast({ title: "Action Denied", description: "Administrators cannot delete their own account.", variant: "destructive"});
            return;
        }

        try {
            await apiClient(`/admin/users/${userId}`, 'DELETE');
            toast({ title: "Success", description: `User "${userEmail}" deleted successfully.` });
            fetchUsers();
        } catch (err: any) {
             toast({ title: "Error Deleting User", description: err.message, variant: "destructive" });
        }
    };

    const renderPaginationItems = () => {
         const items = [];
         const maxPagesToShow = 5;
         const halfMaxPages = Math.floor(maxPagesToShow / 2);
         let startPage = Math.max(1, currentPage - halfMaxPages);
         let endPage = Math.min(totalPages, currentPage + halfMaxPages);

         if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; }
         else if (currentPage <= halfMaxPages) { endPage = maxPagesToShow; }
         else if (currentPage + halfMaxPages >= totalPages) { startPage = totalPages - maxPagesToShow + 1; }

         if (startPage > 1) {
             items.push(<PaginationItem key={1}><PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink></PaginationItem>);
             if (startPage > 2) { items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>); }
         }
         for (let i = startPage; i <= endPage; i++) { items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>{i}</PaginationLink></PaginationItem>);}
         if (endPage < totalPages) {
             if (endPage < totalPages - 1) { items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>); }
             items.push(<PaginationItem key={totalPages}><PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink></PaginationItem>);
         }
         return items;
     };

     const formatName = (user: User) => {
        return `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.replace(/\s+/g, ' ').trim();
     }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 p-4 md:p-6">
                <div className="container mx-auto max-w-7xl">
                     <div className="mb-6">
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back to Admin Dashboard
                        </Button>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">User Management</h1>
                            <p className="text-muted-foreground">View, edit, and manage library users.</p>
                        </div>
                    </div>

                     <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users by name, email..."
                                className="w-full bg-background pl-8 rounded-md"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(); }}
                            />
                        </div>
                    </div>

                     <div className="rounded-md border">
                         {isLoadingUsers ? (
                             <div className="space-y-1 p-4">
                                 {Array.from({ length: 7 }).map((_, i) => ( <Skeleton key={i} className="h-12 w-full" /> ))}
                             </div>
                         ) : errorUsers ? (
                            <p className="text-center text-destructive py-10">{errorUsers}</p>
                         ) : users.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="hidden md:table-cell">Role</TableHead>
                                        <TableHead className="hidden sm:table-cell">Verified</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{formatName(user)}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {user.email_verified ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-destructive" />
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)} aria-label="Edit User">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                         <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Delete User"
                                                            disabled={currentAdminUser?.id === user.id}
                                                          >
                                                            <Trash className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the user "{formatName(user)}" ({user.email}). Active loans must be returned first.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                                className={buttonVariants({ variant: "destructive" })}
                                                            >
                                                                Delete User
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         ) : (
                             <p className="text-center text-muted-foreground py-10">
                                 {searchQuery ? `No users found matching "${searchQuery}".` : "No users found."}
                             </p>
                         )}
                     </div>

                      {!isLoadingUsers && !errorUsers && totalPages > 1 && (
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
    );
}