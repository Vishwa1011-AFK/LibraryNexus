"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, parse, isValid } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { AuthUser } from "@/types";

export default function EditProfilePage() {
    const { user, isLoading: authLoading, updateUserContext } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dob, setDob] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setMiddleName(user.middleName || "");
            setLastName(user.lastName || "");
            if (user.birthDate) {
                try {
                    const dateObj = typeof user.birthDate === 'string' ? new Date(user.birthDate) : user.birthDate;
                    if (isValid(dateObj)) {
                        setDob(format(dateObj, 'yyyy-MM-dd'));
                    } else {
                        setDob('');
                    }
                } catch {
                    setDob('');
                }
            } else {
                setDob('');
            }
        }
    }, [user]);

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        const payload: { firstName?: string; middleName?: string; lastName?: string; birthDate?: string } = {};
        if (firstName !== user?.firstName) payload.firstName = firstName;
        if (middleName !== user?.middleName) payload.middleName = middleName;
        if (lastName !== user?.lastName) payload.lastName = lastName;

        let originalDobFormatted = '';
        if (user?.birthDate) {
            try {
                const dateObj = typeof user.birthDate === 'string' ? new Date(user.birthDate) : user.birthDate;
                if (isValid(dateObj)) {
                    originalDobFormatted = format(dateObj, 'yyyy-MM-dd');
                }
            } catch {}
        }

        if (dob && dob !== originalDobFormatted) {
            try {
                const parsedDate = parse(dob, 'yyyy-MM-dd', new Date());
                if (isValid(parsedDate)) {
                    payload.birthDate = parsedDate.toISOString();
                } else {
                    toast({ title: "Invalid Date", description: "Please enter a valid date of birth.", variant: "destructive" });
                    setIsSubmitting(false);
                    return;
                }
            } catch {
                toast({ title: "Invalid Date Format", description: "Please use YYYY-MM-DD format.", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }
        }

        if (Object.keys(payload).length === 0) {
            toast({ title: "No Changes", description: "You haven't made any changes to save." });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await apiClient<{ user: AuthUser, message: string }>('/users/me', 'PATCH', payload);
            toast({ title: "Success", description: response.message || "Profile updated successfully!" });
            updateUserContext(response.user);
            router.push('/account');
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            toast({ title: "Update Failed", description: error.message || "Could not update profile.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <Skeleton className="h-9 w-1/3 mb-8" />
                        <div className="bg-card rounded-lg p-6 mb-6 space-y-6">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
                    <div className="bg-card rounded-lg p-6 mb-6 space-y-6">
                        <Input id="first-name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isSubmitting} />
                        <Input id="middle-name" type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="(Optional)" disabled={isSubmitting} />
                        <Input id="last-name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isSubmitting} />
                        <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveChanges} disabled={isSubmitting || authLoading}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
                        <Button variant="outline" className="ml-4" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
