"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EditProfilePage() {
  const [firstName, setFirstName] = useState("Diwakar")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("Dubey")
  const [dob, setDob] = useState("03/03/2004")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

          <div className="bg-card rounded-lg p-6 mb-6">
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
                  <label htmlFor="first-name" className="text-lg">
                    First Name
                  </label>
                </div>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                      className="lucide lucide-user"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                  </span>
                  <label htmlFor="middle-name" className="text-lg">
                    Middle Name
                  </label>
                </div>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="middle-name"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
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
                      className="lucide lucide-user"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                  </span>
                  <label htmlFor="last-name" className="text-lg">
                    Last Name
                  </label>
                </div>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  <label htmlFor="dob" className="text-lg">
                    Date of birth
                  </label>
                </div>
                <span className="mx-4 text-xl">:</span>
                <Input
                  id="dob"
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="flex-1 bg-muted/50 border-muted"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => console.log("Save Changes clicked")}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

