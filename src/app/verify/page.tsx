"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function VerifyAccount() {
    const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
    const [isLoadingVerify, setIsLoadingVerify] = useState(false);
    const [isLoadingResend, setIsLoadingResend] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const storedEmail = localStorage.getItem('verificationEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            const parts = storedEmail.split('@');
            if (parts.length === 2) {
                setMaskedEmail(`${parts[0].substring(0, 3)}***@${parts[1]}`);
            } else {
                setMaskedEmail('your email address');
            }
        } else {
            setError("Could not find email address for verification. Please sign up again.");
            toast({ title: "Error", description: "Email address not found for verification.", variant: "destructive" });
        }
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleInputChange = (index: number, value: string) => {
        const digit = value.match(/^[0-9]$/);
        if (value === "" || digit) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            if (digit && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newCode = [...verificationCode];
            if (newCode[index] !== "") {
                newCode[index] = "";
                setVerificationCode(newCode);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
                newCode[index - 1] = "";
                setVerificationCode(newCode);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (paste.length === 6) {
            const newCode = paste.split('');
            setVerificationCode(newCode);
            inputRefs.current[5]?.focus();
        } else if (paste.length > 0) {
            const newCode = Array(6).fill('');
            paste.split('').slice(0, 6).forEach((char, index) => {
                newCode[index] = char;
            });
            setVerificationCode(newCode);
            inputRefs.current[Math.min(5, paste.length)]?.focus();
        }
    };

    const handleVerify = async () => {
        if (!email) {
            toast({ title: "Error", description: "Email address not found.", variant: "destructive" });
            return;
        }
        const code = verificationCode.join("");
        if (code.length !== 6) {
            setError("Please enter the complete 6-digit code.");
            toast({ title: "Incomplete Code", description: "Please enter the complete 6-digit code.", variant: "destructive"});
            return;
        }
        setError(null);
        setIsLoadingVerify(true);
        try {
            await apiClient('/auth/verify-signup', 'POST', { email, otp: code });
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
            setVerificationCode(Array(6).fill(""));
            inputRefs.current[0]?.focus();
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
                <div className="max-w-md w-full mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center mb-4">Verify your account</h1>
                    <p className="text-center text-muted-foreground mb-8">
                        A verification code was sent to {maskedEmail || 'your email address'}.
                        Enter the code below to confirm your account.
                    </p>
                </div>
            </main>
        </div>
    )
}
