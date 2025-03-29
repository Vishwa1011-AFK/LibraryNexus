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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setEmail(searchParams.get("email") || "");
    }, [searchParams]);

    const handleResetPassword = async () => {
        setError(null);

        if (!email || !otp || !newPassword || !confirmPassword) {
            const msg = "Please fill in all fields.";
            setError(msg);
            toast({ title: "Missing Fields", description: msg, variant: "destructive" });
            return;
        }
        if (otp.length !== 8) {
            const msg = "OTP must be 8 characters long.";
            setError(msg);
            toast({ title: "Invalid OTP", description: msg, variant: "destructive" });
            return;
        }
        if (newPassword.length < 8) {
            const msg = "New password must be at least 8 characters long.";
            setError(msg);
            toast({ title: "Password Too Short", description: msg, variant: "destructive" });
            return;
        }
        if (newPassword !== confirmPassword) {
            const msg = "New passwords do not match.";
            setError(msg);
            toast({ title: "Password Mismatch", description: msg, variant: "destructive" });
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
            setError(message);
            toast({ title: "Reset Failed", description: message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-border w-full">
            <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>Enter the OTP sent to your email and choose a new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your account email"
                                required
                                disabled={isLoading || !!initialEmail}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="otp">Verification Code (OTP)</Label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="otp"
                                type="text"
                                maxLength={8}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 8-character code"
                                required
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min. 8 characters)"
                                required
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                required
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive text-center pt-2">{error}</p>}
                    <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleResetPassword}
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
                <Link href="/signin" className="text-sm text-primary hover:underline">
                    Back to Sign In
                </Link>
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
