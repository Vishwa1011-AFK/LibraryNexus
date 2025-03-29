"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function IssueBookPage() {
  const [bookTitle, setBookTitle] = useState("The Master Algorithm")
  const [isbn, setIsbn] = useState("12343278")
  const [userId, setUserId] = useState("")
  const [issueDate, setIssueDate] = useState("")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="text-xl font-medium">Book :</span>
              <span className="ml-4 text-xl">{bookTitle}</span>
            </div>

            <div className="flex items-center">
              <span className="text-xl font-medium">ISBN :</span>
              <span className="ml-4 text-xl text-primary">{isbn}</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Issue to</h2>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex items-center space-x-2 w-48">
                  <span className="text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                  </span>
                  <label htmlFor="user-id" className="text-lg">
                    User Id
                  </label>
                </div>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="flex-1 bg-muted/50 border-muted"
                />
              </div>

              <div className="flex items-center">
                <div className="flex items-center space-x-2 w-48">
                  <span className="text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </span>
                  <label htmlFor="issue-date" className="text-lg">
                    Date of Issue
                  </label>
                </div>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="issue-date"
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="flex-1 bg-muted/50 border-muted"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => console.log("Save clicked")}
            >
              Save
            </Button>

            <Link href="/admin/books">
              <Button variant="outline" className="border-muted text-muted-foreground hover:text-foreground">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

