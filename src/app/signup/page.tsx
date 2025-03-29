"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { type SignupPayload } from "@/types"
import { isValid, parse } from 'date-fns';

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [birthDate, setBirthDate] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({})
    const router = useRouter()
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!firstName.trim()) newErrors.firstName = "First name is required"
        if (!lastName.trim()) newErrors.lastName = "Last name is required"
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required"
        if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters"
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!birthDate || !isValid(parse(birthDate, 'yyyy-MM-dd', new Date()))) newErrors.birthDate = "Valid date required"
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSignUp = async () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please check the form fields.", variant: "destructive"});
            return
        }

        setIsLoading(true);
        setErrors({});

        const payload: SignupPayload = {
            firstName: firstName.trim(),
            middleName: middleName.trim() || undefined,
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
            birthDate: parse(birthDate, 'yyyy-MM-dd', new Date()).toISOString(),
        };

        try {
            await apiClient('/auth/signup', 'POST', payload);
            await apiClient('/auth/signup-otp', 'POST', { email: payload.email });
            toast({ title: "Account Created!", description: "Check your email to verify your account." });
            localStorage.setItem('verificationEmail', payload.email);
            router.push("/verify");
        } catch (error: any) {
            const errorMessage = error.message || "Registration failed. Please try again.";
            setErrors({ form: errorMessage });
            toast({ title: "Registration Failed", description: errorMessage, variant: "destructive" });
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader/>
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 max-w-md">
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-2xl">Create an Account</CardTitle>
                            <CardDescription>Join Nexus Library to access thousands of books</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <FormField id="firstName" label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName} icon={<User className="h-4 w-4" />} required />
                                <FormField id="middleName" label="Middle Name" type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} icon={<User className="h-4 w-4" />} />
                                <FormField id="lastName" label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName} icon={<User className="h-4 w-4" />} required />
                                <FormField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} icon={<Mail className="h-4 w-4" />} required />
                                <Label htmlFor="birthDate">Date of Birth *</Label>
                                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                                {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate}</p>}
                                <FormField id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} icon={<Lock className="h-4 w-4" />} required />
                                <FormField id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} icon={<Lock className="h-4 w-4" />} required />
                                {errors.form && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{errors.form}</div>}
                                <Button className="w-full py-6 text-lg mt-4" onClick={handleSignUp} disabled={isLoading}>{isLoading ? "Creating Account..." : "Sign Up"}</Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t pt-4">
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
