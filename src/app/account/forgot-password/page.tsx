"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Mail } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordRequestPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRequestReset = async () => {
    setError(null);
    setIsSubmitted(false);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        const msg = "Please enter a valid email address.";
        setError(msg);
        toast({ title: "Invalid Email", description: msg, variant: "destructive" });
        return;
    }

    setIsLoading(true);
    try {
        await apiClient('/auth/forgot', 'POST', { email });
        setIsSubmitted(true);
        toast({ title: "Request Sent", description: "If an account exists for this email, an OTP has been sent." });
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
         console.error("Forgot password request failed:", error);
         const genericMessage = "Could not process request. Please try again later.";
         setError(genericMessage);
         toast({ title: "Error", description: genericMessage, variant: "destructive" });
         setIsSubmitted(false);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email address below to receive a password reset code.</CardDescription>
            </CardHeader>
            <CardContent>
                {isSubmitted ? (
                     <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md">
                        <p className="font-medium text-green-800 dark:text-green-300">Request Sent!</p>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                             If an account exists for {email}, an email with a verification code has been sent. Please also check your spam folder.
                        </p>
                         <p className="text-sm mt-3">
                             <Link href={`/reset-password?email=${encodeURIComponent(email)}`} className="text-primary underline">
                                 Proceed to Enter Code
                             </Link>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email Address</Label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your account email"
                                    required
                                    disabled={isLoading}
                                    className="pl-10"
                                />
                             </div>
                        </div>

                        {error && <p className="text-sm text-destructive text-center pt-1">{error}</p>}

                        <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={handleRequestReset}
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Send Reset Code"}
                        </Button>
                    </div>
                )}
            </CardContent>
             <CardFooter className="flex justify-center border-t pt-4">
                <Link href="/signin" className="text-sm text-primary hover:underline">
                    Back to Sign In
                </Link>
             </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}