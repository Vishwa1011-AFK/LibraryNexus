"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Change Password</h1>

          <div className="bg-card rounded-lg p-6 mb-6">
            <div className="space-y-6">
              <div className="flex items-center">
                <label htmlFor="current-password" className="w-48 text-lg">
                  Current Password
                </label>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="flex-1 bg-muted/50 border-muted"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
            <div className="space-y-6">
              <div className="flex items-center">
                <label htmlFor="new-password" className="w-48 text-lg">
                  New Password
                </label>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 bg-muted/50 border-muted"
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="confirm-password" className="w-48 text-lg">
                  Renter new Password
                </label>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 bg-muted/50 border-muted"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/account/forgot-password">
              <Button variant="link" className="text-muted-foreground hover:text-primary px-0">
                Forget Password?
              </Button>
            </Link>

            <div className="space-x-4">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => console.log("Submit clicked")}
              >
                Submit
              </Button>

              <Link href="/account">
                <Button variant="outline" className="border-muted text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

