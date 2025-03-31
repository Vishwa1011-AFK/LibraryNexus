"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { AdminUserForm } from "@/components/admin-user-form";
import { apiClient } from '@/lib/api';
import { type User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const userId = params.userId as string;

    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = useCallback(async () => {
        if (!userId) {
            setError("Invalid User ID.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const fetchedUser = await apiClient<User>(`/admin/users/${userId}`);
            setUserData(fetchedUser);
        } catch (err: any) {
            setError(err.message || "Failed to load user data for editing.");
            toast({ title: "Error Loading User Data", description: err.message, variant: "destructive" });
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, [userId, toast]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (isLoading) {
        return (
             <div className="flex min-h-screen flex-col">
                 <SiteHeader />
                 <main className="flex-1 py-8">
                     <div className="container mx-auto px-4 max-w-2xl">
                         <Skeleton className="h-8 w-1/3 mb-6" />
                         <Skeleton className="h-10 w-1/2 mb-4" />
                         <Skeleton className="h-96 w-full" />
                     </div>
                 </main>
             </div>
        );
    }

    if (error || !userData) {
         return (
             <div className="flex min-h-screen flex-col">
                 <SiteHeader />
                 <main className="flex-1 py-8">
                      <div className="container mx-auto px-4 max-w-2xl text-center">
                           <div className="mb-6 float-left">
                               <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
                                   <ArrowLeft className="mr-2 h-4 w-4"/> Back to Users List
                               </Button>
                           </div>
                          <div className="clear-both pt-10 text-destructive">
                               <p>{error || "Could not load user data for editing."}</p>
                          </div>
                      </div>
                 </main>
             </div>
         );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <AdminUserForm userData={userData} />
            </main>
        </div>
    );
}