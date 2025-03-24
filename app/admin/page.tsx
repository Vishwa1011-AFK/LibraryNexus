"use client"

import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { FeaturedBooks } from "@/components/books/featured-books"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock, BarChart } from "lucide-react"
import Link from "next/link"

// This would be replaced with a real API call
const getDashboardStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    totalBooks: 1248,
    newBooks: 12,
    activeUsers: 573,
    userGrowth: 42,
    booksBorrowed: 342,
    borrowedGrowth: 18,
    overdueReturns: 24,
    overdueChange: -4,
  }
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAdmin={true} />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Nexus Admin Dashboard
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Manage your library system, track books, and handle user transactions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-primary text-primary-foreground" asChild>
                    <Link href="/admin/books/new">Add New Book</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/admin/reports">View Reports</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="book-cover">
                      <img src="/placeholder.svg?height=240&width=160" alt="Book cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : stats?.totalBooks}</div>
                  <p className="text-xs text-muted-foreground">
                    +{isLoading ? "..." : stats?.newBooks} added this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : stats?.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{isLoading ? "..." : stats?.userGrowth} from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : stats?.booksBorrowed}</div>
                  <p className="text-xs text-muted-foreground">
                    +{isLoading ? "..." : stats?.borrowedGrowth}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Returns</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : stats?.overdueReturns}</div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "..." : stats?.overdueChange}% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <FeaturedBooks isAdmin={true} />
          </div>
        </section>
      </main>
    </div>
  )
}

