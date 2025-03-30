"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

export default function VerifyAccount() {
    const [otp, setOtp] = useState("");
    const [isLoadingVerify, setIsLoadingVerify] = useState(false);
    const [isLoadingResend, setIsLoadingResend] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const storedEmail = localStorage.getItem('verificationEmail') || new URLSearchParams(window.location.search).get('email');
        if (storedEmail) {
            setEmail(storedEmail);
            const parts = storedEmail.split('@');
            if (parts.length === 2) {
                setMaskedEmail(`${parts[0].substring(0, 3)}***@${parts[1]}`);
            } else {
                setMaskedEmail('your email address');
            }
        } else {
            setError("Could not find email address for verification. Please sign up again or check the link.");
            toast({ title: "Error", description: "Email address not found for verification.", variant: "destructive" });
        }
    }, [toast]);


    const handleVerify = async () => {
        if (!email) {
            toast({ title: "Error", description: "Email address not found.", variant: "destructive" });
            return;
        }

        if (otp.length !== 8) {
            setError("Please enter the complete 8-character code.");
            toast({ title: "Incomplete Code", description: "Please enter the complete 8-character code.", variant: "destructive"});
            return;
        }
        setError(null);
        setIsLoadingVerify(true);
        try {
            await apiClient('/auth/verify-signup', 'POST', { email, otp: otp.toUpperCase() });
            toast({ title: "Success!", description: "Your account has been verified. Please sign in." });
            localStorage.removeItem('verificationEmail');
            router.replace('/signin');
        } catch (error: any) {
            console.error("Verification failed:", error);
            const message = error.message || "Verification failed. Please check the code or resend.";
            setError(message);
            toast({ title: "Verification Failed", description: message, variant: "destructive" });
        } finally {
            setIsLoadingVerify(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast({ title: "Error", description: "Email address not found.", variant: "destructive" });
            return;
        }
        setError(null);
        setIsLoadingResend(true);
        try {
            await apiClient('/auth/signup-otp', 'POST', { email });
            toast({ title: "Code Resent", description: "A new verification code has been sent to your email." });
            setOtp("");
        } catch (error: any) {
            console.error("Failed to resend code:", error);
            const message = error.message || "Failed to resend code. Please try again later.";
            setError(message);
            toast({ title: "Error", description: message, variant: "destructive" });
        } finally {
            setIsLoadingResend(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader/>
            <main className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="max-w-md w-full mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold mb-4">Verify your account</h1>
                    <p className="text-muted-foreground mb-8">
                        An 8-character verification code was sent to {maskedEmail || 'your email address'}.
                        Enter the code below.
                    </p>

                     <div className="flex justify-center mb-6">
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


                    {error && <p className="text-destructive text-sm mb-4">{error}</p>}

                    <Button
                        onClick={handleVerify}
                        disabled={isLoadingVerify || otp.length !== 8}
                        className="w-full mb-4"
                        size="lg"
                    >
                        {isLoadingVerify ? "Verifying..." : "Verify Account"}
                    </Button>

                    <Button
                        variant="link"
                        onClick={handleResend}
                        disabled={isLoadingResend || !email}
                        className="text-primary"
                    >
                        {isLoadingResend ? "Sending..." : "Didn't receive code? Resend"}
                    </Button>
                </div>
            </main>
        </div>
    )
}