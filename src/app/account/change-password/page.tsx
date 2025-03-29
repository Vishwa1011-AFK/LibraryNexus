"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async () => {
        setError(null)

        if (!currentPassword || !newPassword || !confirmPassword) {
            const msg = "Please fill in all password fields."
            setError(msg)
            toast({ title: "Missing Fields", description: msg, variant: "destructive" })
            return
        }
        if (newPassword.length < 8) {
            const msg = "New password must be at least 8 characters long."
            setError(msg)
            toast({ title: "Password Too Short", description: msg, variant: "destructive" })
            return
        }
        if (newPassword !== confirmPassword) {
            const msg = "New passwords do not match."
            setError(msg)
            toast({ title: "Password Mismatch", description: msg, variant: "destructive" })
            return
        }
        if (currentPassword === newPassword) {
            const msg = "New password cannot be the same as the current password."
            setError(msg)
            toast({ title: "Invalid Password", description: msg, variant: "destructive" })
            return
        }

        setIsLoading(true)
        try {
            const payload = { currentPassword, newPassword }
            await apiClient('/users/me/password', 'PUT', payload)
            toast({ title: "Success", description: "Password changed successfully! Please log in again." })
            router.replace('/signin')
        } catch (error: any) {
            console.error("Failed to change password:", error)
            const errorMessage = error.message || "Failed to change password. Please check your current password."
            setError(errorMessage)
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader/>
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-3xl font-bold mb-8">Change Password</h1>

                    <div className="bg-card rounded-lg p-6 mb-6">
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <label htmlFor="current-password" className="w-full sm:w-48 text-lg mb-2 sm:mb-0">Current Password</label>
                                <span className="hidden sm:inline mx-4 text-xl">:</span>
                                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="flex-1 bg-muted/50 border-muted" disabled={isLoading} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg p-6 mb-6">
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                                <label htmlFor="new-password" className="w-full sm:w-48 text-lg mb-2 sm:mb-0">New Password</label>
                                <span className="hidden sm:inline mx-4 text-xl">:</span>
                                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1 bg-muted/50 border-muted" disabled={isLoading} />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <label htmlFor="confirm-password" className="w-full sm:w-48 text-lg mb-2 sm:mb-0">Re-enter new Password</label>
                                <span className="hidden sm:inline mx-4 text-xl">:</span>
                                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="flex-1 bg-muted/50 border-muted" disabled={isLoading} />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-center text-destructive mb-4">{error}</p>}

                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <Link href="/account/forgot-password">
                            <Button variant="link" className="text-muted-foreground hover:text-primary px-0 mb-4 sm:mb-0">Forget Password?</Button>
                        </Link>
                        <div className="space-x-4">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Updating..." : "Submit"}</Button>
                            <Link href="/account">
                                <Button variant="outline" className="border-muted text-muted-foreground hover:text-foreground" disabled={isLoading}>Cancel</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
