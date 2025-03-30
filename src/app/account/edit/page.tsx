"use client"

import { useState, useEffect } from "react"
import { useRouter, redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format, parse, isValid } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SignupPayload, type AuthUser } from "@/types";
import { ProtectedRoute } from "@/components/protected-route";

export default function EditProfilePage() {
    const { user, isLoading: authLoading, updateUserContext } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dob, setDob] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setMiddleName(user.middleName || "");
            setLastName(user.lastName || "");
            if (user.birthDate) {
                try {
                    const dateObj = typeof user.birthDate === 'string'
                        ? parse(user.birthDate, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date())
                        : user.birthDate;

                    if (isValid(dateObj)) {
                        setDob(format(dateObj, 'yyyy-MM-dd'));
                    } else {
                        console.warn("Invalid birthDate from context:", user.birthDate);
                        setDob('');
                    }
                } catch (e) {
                     console.error("Error parsing birthDate:", e);
                     setDob('');
                }
            } else {
                setDob('');
            }
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (!user) return;
        setIsSubmitting(true);
        setErrors({});

        const payload: Partial<SignupPayload> = {};

        if (firstName.trim() !== user.firstName) payload.firstName = firstName.trim();
        if (middleName.trim() !== (user.middleName || "")) payload.middleName = middleName.trim();
        if (lastName.trim() !== user.lastName) payload.lastName = lastName.trim();

        let originalDobFormatted = '';
        if (user.birthDate) {
             try {
                 const dateObj = typeof user.birthDate === 'string' ? new Date(user.birthDate) : user.birthDate;
                 if (isValid(dateObj)) {
                     originalDobFormatted = format(dateObj, 'yyyy-MM-dd');
                 }
             } catch {}
         }

        if (dob && dob !== originalDobFormatted) {
            const parsedDate = parse(dob, 'yyyy-MM-dd', new Date());
            if (isValid(parsedDate)) {
                payload.birthDate = parsedDate.toISOString();
            } else {
                setErrors({ birthDate: "Invalid date format (YYYY-MM-DD)." });
                toast({ title: "Invalid Input", description: "Please enter a valid date of birth.", variant: "destructive"});
                setIsSubmitting(false);
                return;
            }
        } else if (!dob && user.birthDate) {
        }


        if (Object.keys(payload).length === 0) {
            toast({ title: "No Changes", description: "You haven't made any changes to save." });
            setIsSubmitting(false);
            return;
        }

         if (payload.firstName === "") setErrors(prev => ({...prev, firstName: "First name cannot be empty"}));
         if (payload.lastName === "") setErrors(prev => ({...prev, lastName: "Last name cannot be empty"}));
         if (errors.firstName || errors.lastName) {
              toast({ title: "Invalid Input", description: "Please check the name fields.", variant: "destructive"});
              setIsSubmitting(false);
              return;
         }


        try {
            const response = await apiClient<{user: AuthUser, message: string}>('/users/me', 'PATCH', payload);
            toast({ title: "Success", description: response.message || "Profile updated successfully!" });
            updateUserContext(response.user);
            router.push('/account');
        } catch (error: any) {
            setErrors({ form: error.message || "Could not update profile." });
            toast({ title: "Update Failed", description: error.message || "Could not update profile.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
         <ProtectedRoute>
             <div className="flex min-h-screen flex-col">
                 <SiteHeader/>
                 <main className="flex-1 py-8">
                     <div className="container mx-auto px-4 max-w-3xl">
                         <Card className="border-border">
                            <CardHeader>
                                 <CardTitle className="text-2xl">Edit Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                     <Label htmlFor="firstName" className={cn(errors.firstName && "text-destructive")}>First Name *</Label>
                                     <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={cn("col-span-2", errors.firstName && "border-destructive")} disabled={isSubmitting} />
                                     {errors.firstName && <p className="col-span-full text-sm text-destructive -mt-4">{errors.firstName}</p>}
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                     <Label htmlFor="middleName">Middle Name</Label>
                                     <Input id="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="col-span-2" disabled={isSubmitting} />
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                     <Label htmlFor="lastName" className={cn(errors.lastName && "text-destructive")}>Last Name *</Label>
                                     <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={cn("col-span-2", errors.lastName && "border-destructive")} disabled={isSubmitting} />
                                     {errors.lastName && <p className="col-span-full text-sm text-destructive -mt-4">{errors.lastName}</p>}
                                </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                     <Label htmlFor="email">Email</Label>
                                     <Input id="email" value={user?.email || ''} className="col-span-2 bg-muted/50" disabled readOnly />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                     <Label htmlFor="dob" className={cn(errors.birthDate && "text-destructive")}>Date of Birth</Label>
                                     <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={cn("col-span-2", errors.birthDate && "border-destructive")} disabled={isSubmitting} max={format(new Date(), 'yyyy-MM-dd')} />
                                     {errors.birthDate && <p className="col-span-full text-sm text-destructive -mt-4">{errors.birthDate}</p>}
                                </div>
                             </CardContent>
                             <CardFooter className="flex justify-end space-x-4 border-t pt-6">
                                {errors.form && <p className="text-sm text-destructive mr-auto">{errors.form}</p>}
                                 <Link href="/account">
                                     <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
                                 </Link>
                                 <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                                     {isSubmitting ? "Saving..." : "Save Changes"}
                                 </Button>
                             </CardFooter>
                         </Card>
                     </div>
                 </main>
             </div>
        </ProtectedRoute>
    );
}