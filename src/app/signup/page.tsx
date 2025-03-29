"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock, Key } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [adminCode, setAdminCode] = useState("")
  const [userType, setUserType] = useState("user")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (userType === "admin" && !adminCode) {
      newErrors.adminCode = "Admin code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await register(name)
      router.push("/verify")
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors({
        form: "Registration failed. Please try again.",
      })
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
              <Tabs defaultValue="user" onValueChange={(value) => setUserType(value)} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <FormField
                  id="name"
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  error={errors.name}
                  icon={<User className="h-4 w-4" />}
                  required
                />

                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  error={errors.email}
                  icon={<Mail className="h-4 w-4" />}
                  required
                />

                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  error={errors.password}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />

                <FormField
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />

                {userType === "admin" && (
                  <FormField
                    id="admin-code"
                    label="Admin Code"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin authorization code"
                    error={errors.adminCode}
                    icon={<Key className="h-4 w-4" />}
                    required
                  />
                )}

                {errors.form && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{errors.form}</div>
                )}

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg mt-4"
                  onClick={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}