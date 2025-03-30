"use client"

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mail, Key, Lock } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const initialEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setEmail(searchParams.get("email") || "");
    }, [searchParams]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email.";
        if (!otp) newErrors.otp = "OTP is required.";
        else if (otp.length !== 8) newErrors.otp = "OTP must be 8 characters.";
        if (!newPassword) newErrors.password = "New password is required.";
        else if (newPassword.length < 8) newErrors.password = "Password must be at least 8 characters.";
        if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleResetPassword = async () => {
        setErrors({});
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please check the fields below.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            await apiClient('/auth/verify-reset', 'POST', {
                email,
                otp: otp.toUpperCase(),
                newPassword
            });

            toast({ title: "Success", description: "Your password has been reset successfully. Please sign in." });
            router.replace('/signin');
        } catch (error: any) {
            console.error("Password reset failed:", error);
            const message = error.message || "Password reset failed. Please check the OTP or request a new one.";
            setErrors({ form: message });
            toast({ title: "Reset Failed", description: message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-border w-full">
            <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>Enter the 8-character OTP sent to your email ({email || '...'}) and choose a new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="email" type="email" value={email} required disabled className="pl-10 bg-muted/30" readOnly/>
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-1">
                         <Label htmlFor="otp" className={cn("block mb-2", errors.otp && "text-destructive")}>Verification Code (OTP)</Label>
                         <div className="flex justify-center">
                             <InputOTP maxLength={8} value={otp} onChange={(value) => setOtp(value)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                                 <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                    <InputOTPSlot index={6} />
                                    <InputOTPSlot index={7} />
                                </InputOTPGroup>
                            </InputOTP>
                         </div>
                         {errors.otp && <p className="text-sm text-destructive text-center mt-1">{errors.otp}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new-password" className={cn(errors.password && "text-destructive")}>New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min. 8 characters)" required disabled={isLoading} className={cn("pl-10", errors.password && "border-destructive")} />
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="confirm-password" className={cn(errors.confirmPassword && "text-destructive")}>Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" required disabled={isLoading} className={cn("pl-10", errors.confirmPassword && "border-destructive")} />
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>
                    {errors.form && <p className="text-sm text-destructive text-center pt-2">{errors.form}</p>}
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleResetPassword} disabled={isLoading}>{isLoading ? "Resetting..." : "Reset Password"}</Button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 border-t pt-4">
                 <Link href="/account/forgot-password" className="text-sm text-primary hover:underline"> Request new code </Link>
                 <Link href="/signin" className="text-sm text-primary hover:underline"> Back to Sign In </Link>
            </CardFooter>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader/>
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <Suspense fallback={<div className="text-center">Loading form...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}