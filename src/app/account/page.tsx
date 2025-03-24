import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

// Sample user data
const userData = {
  name: "Anmol Yadav",
  email: "aydv47@gmail.com",
  dob: "03/03/2004",
  books: [
    { id: 1, title: "To Kill a Mockingbird", author: "Keyley Jenner" },
    { id: 2, title: "To Kill a Mockingbird", author: "Keyley Jenner" },
    { id: 3, title: "To Kill a Mockingbird", author: "Keyley Jenner" },
    { id: 4, title: "To Kill a Mockingbird", author: "Keyley Jenner" },
  ],
}

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div className="bg-card rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Personal Info</h2>
                <Link href="/account/edit">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-5 w-5 text-primary" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
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
                    <span className="text-muted-foreground">Name</span>
                  </div>
                  <span className="text-lg">:</span>
                  <span>{userData.name}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
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
                        className="lucide lucide-mail"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <span className="text-muted-foreground">Email ID</span>
                  </div>
                  <span className="text-lg">:</span>
                  <span>{userData.email}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
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
                    <span className="text-muted-foreground">Date of birth</span>
                  </div>
                  <span className="text-lg">:</span>
                  <span>{userData.dob}</span>
                </div>
              </div>

              <div className="mt-6 text-right">
                <Link href="/account/change-password">
                  <Button variant="link" className="text-muted-foreground hover:text-primary">
                    Change password
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Books<span className="text-primary">(4)</span>
                </h2>
                <div className="text-right text-muted-foreground">Author</div>
              </div>

              <div className="bg-card rounded-lg overflow-hidden">
                {userData.books.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex justify-between items-center p-4 border-b border-muted last:border-0"
                  >
                    <div className="flex items-center">
                      <span className="text-primary mr-4">{index + 1}.</span>
                      <span>{book.title}</span>
                    </div>
                    <div className="text-muted-foreground">{book.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

