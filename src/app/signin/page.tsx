"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/store/auth-store"

export default function SignIn() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // This would be a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      if (email === "admin@example.com" && password === "password") {
        login({
          user: {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          },
          token: "mock-jwt-token",
        })
        router.push("/admin")
      } else if (email === "user@example.com" && password === "password") {
        login({
          user: {
            id: "2",
            name: "Regular User",
            email: "user@example.com",
            role: "member",
          },
          token: "mock-jwt-token",
        })
        router.push("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 w-full max-w-5xl px-4">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Sign in to access Nexus</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your account and manage your books
              </p>
            </div>
            {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button className="w-full bg-primary text-primary-foreground" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Demo credentials:</p>
              <p>Admin: admin@example.com / password</p>
              <p>User: user@example.com / password</p>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative h-[350px] w-[300px] overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg?height=350&width=300"
                alt="Library illustration"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

