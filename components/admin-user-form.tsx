"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type User } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const userEditFormSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: "Last name is required" }),
    birthDate: z.string().optional(),
    role: z.enum(['student', 'admin'], { required_error: "Role is required" }),
    email_verified: z.boolean().default(false),
});

type UserEditFormData = z.infer<typeof userEditFormSchema>;

interface AdminUserFormProps {
    userData: User;
}

export function AdminUserForm({ userData }: AdminUserFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { user: currentAdminUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const formatDateForInput = (date: string | Date | undefined): string => {
        if (!date) return '';
        try {
            return format(new Date(date), 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserEditFormData>({
        resolver: zodResolver(userEditFormSchema),
        defaultValues: {
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            lastName: userData.lastName || '',
            birthDate: formatDateForInput(userData.birthDate),
            role: userData.role || 'student',
            email_verified: userData.email_verified || false,
        },
    });

    useEffect(() => {
        reset({
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            lastName: userData.lastName || '',
            birthDate: formatDateForInput(userData.birthDate),
            role: userData.role || 'student',
            email_verified: userData.email_verified || false,
        });
    }, [userData, reset]);

    const onSubmit: SubmitHandler<UserEditFormData> = async (data) => {
        if (currentAdminUser?.id === userData.id && data.role !== 'admin') {
             toast({ title: "Action Denied", description: "You cannot change your own role from Admin.", variant: "destructive" });
             return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...data,
                birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
            };

            await apiClient(`/api/admin/users/${userData.id}`, 'PUT', payload);
            toast({ title: "Success", description: `User "${data.firstName} ${data.lastName}" updated successfully.` });
            router.push('/admin/users');
            router.refresh();

        } catch (err: any) {
            toast({
                title: "Error Updating User",
                description: err.message || "Failed to update user.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="container mx-auto px-4 max-w-2xl py-8">
             <div className="mb-6">
                 <Button variant="outline" size="sm" onClick={() => router.push('/admin/users')}>
                     <ArrowLeft className="mr-2 h-4 w-4"/> Back to Users List
                 </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Edit User: {userData.firstName} {userData.lastName}</CardTitle>
                    <CardDescription>Modify user details below. Email cannot be changed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                                <Input id="firstName" {...register("firstName")} disabled={isLoading} />
                                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input id="middleName" {...register("middleName")} disabled={isLoading} />
                                {errors.middleName && <p className="text-sm text-destructive">{errors.middleName.message}</p>}
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                                <Input id="lastName" {...register("lastName")} disabled={isLoading} />
                                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthDate">Birth Date</Label>
                                <Input id="birthDate" type="date" {...register("birthDate")} disabled={isLoading} />
                                {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
                                <Controller
                                      name="role"
                                      control={control}
                                      render={({ field }) => (
                                          <Select
                                              onValueChange={field.onChange}
                                              value={field.value}
                                              disabled={isLoading || currentAdminUser?.id === userData.id}
                                          >
                                              <SelectTrigger id="role">
                                                  <SelectValue placeholder="Select role" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  <SelectItem value="student">Student</SelectItem>
                                                  <SelectItem value="admin">Admin</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      )}
                                  />
                                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                                {currentAdminUser?.id === userData.id && <p className="text-xs text-muted-foreground">Admins cannot change their own role.</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Email (Cannot be changed)</Label>
                                <Input value={userData.email} readOnly disabled className="bg-muted/50" />
                            </div>
                        </div>

                         <div className="flex items-center space-x-2 pt-2">
                             <Checkbox
                                id="email_verified"
                                {...register("email_verified")}
                                disabled={isLoading}
                             />
                             <Label htmlFor="email_verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email Verified
                             </Label>
                             {errors.email_verified && <p className="text-sm text-destructive">{errors.email_verified.message}</p>}
                        </div>


                        <div className="flex justify-end pt-4">
                             <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                                {isLoading ? 'Saving Changes...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}