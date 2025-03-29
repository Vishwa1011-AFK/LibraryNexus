"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3, Clock, Search, Mail, Lock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login, user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.push(user.isAdmin ? "/admin" : "/library")
    }
  }, [user, authLoading, router])

  const handleSignIn = async () => {
    setError(null)
    if (!email || !password) {
      setError("Please enter both email and password.")
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      await login({ email, password })
      toast({ title: "Login Successful", description: "Redirecting..." })
      router.push("/library")
    } catch (err: any) {
      setError(err.message)
      toast({ title: "Login Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-4">Sign in to access 3000+ books from institute's LRC</h1>
                <p className="text-muted-foreground">Explore our digital library with your account credentials</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Grid3X3 className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Digital Library Access</h3>
                    <p className="text-muted-foreground">Provides access to a collection of e-books, audiobooks, and online journals that users can borrow.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Real-Time Availability Check</h3>
                    <p className="text-muted-foreground">You get real-time updates on whether a book is currently available, checked out, or reserved.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Search className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Search Interface</h3>
                    <p className="text-muted-foreground">A user-friendly search bar where users can enter keywords, titles, authors, or ISBN numbers to find specific books.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      icon={<Mail className="h-4 w-4" />}
                      required
                    />
                    <FormField
                      id="password"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      icon={<Lock className="h-4 w-4" />}
                      required
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSignIn} disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline">Create a new account</Link>
                  </div>
                  <div className="text-center text-sm">
                    <Link href="/account/forgot-password" className="text-primary hover:underline">Forgot Password?</Link>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}