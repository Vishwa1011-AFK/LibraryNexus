"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid3X3, Clock, Search } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("User")
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      router.push("/library")
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-6">Sign Up to access 3000+ books from institute&apos;s LRC</h1>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Grid3X3 className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Digital Library Access</h3>
                    <p className="text-muted-foreground">
                      Provides access to a collection of e-books, audiobooks, and online journals that users can borrow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Real-Time Availability Check</h3>
                    <p className="text-muted-foreground">
                      You get real-time updates on whether a book is currently available, checked out, or reserved.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Search className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Search Interface</h3>
                    <p className="text-muted-foreground">
                      A user-friendly search bar where users can enter keywords, titles, authors, or ISBN numbers to
                      find specific books.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <div className="text-sm text-muted-foreground">
                  as a User /{" "}
                  <Link href="/admin/signin" className="text-primary">
                    Admin
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-muted-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted/50 border-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-muted-foreground">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/50 border-muted"
                  />
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
                  onClick={handleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Create a{" "}
                  <Link href="/signup" className="text-primary">
                    new account
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

