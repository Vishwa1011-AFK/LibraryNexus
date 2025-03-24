import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

// This would normally come from a database
const book = {
  id: "1",
  title: "The Master Algorithm",
  author: "Pedro Domingos",
  description:
    "Machine learning is the automation of discovery,the scientific method on steroids,that enables intelligent robots and computers to program themselves. No field of science today is more important yet more shrouded in mystery. Pedro Domingos, one of the field's leading lights, lifts the veil for the first time to give us a peek inside the learning machines that power Google, Amazon, and your smartphone",
  shelf: "Shelf 3A Book 22",
  isbn: "12343278",
  totalCopies: 4,
  availableCopies: 2,
  pages: 352,
  language: "English",
  coverUrl: "/placeholder.svg?height=400&width=260",
  issueHistory: [
    { id: "XX341", issuedOn: "12-06-2024", userId: "1234321", submissionDate: "27-06-2024", status: "Issued" },
    { id: "XX342", issuedOn: "10-06-2024", userId: "1234321", submissionDate: "25-06-2024", status: "Submitted" },
    { id: "XX343", issuedOn: "15-06-2024", userId: "1234321", submissionDate: "30-06-2024", status: "Submitted" },
    { id: "XX344", issuedOn: "09-06-2024", userId: "1234321", submissionDate: "16-06-2024", status: "Issued" },
  ],
}

export default function AdminBookDetail({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isLoggedIn={true} />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 border-b border-muted pb-4">
            <div>
              <span className="text-lg">Name</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">Diwakar Dubey</span>
              <span className="ml-2 px-2 py-1 text-xs bg-orange-600 rounded text-white">Admin</span>
            </div>
            <div>
              <span className="text-lg">Email ID</span>
              <span className="mx-4 text-xl">:</span>
              <span className="text-lg">dd34@gmail.com</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="text-lg">ISBN :</span>
              <span className="ml-4 text-lg text-primary">{book.isbn}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
            <div>
              <Image
                src={book.coverUrl || "/placeholder.svg"}
                alt={book.title}
                width={300}
                height={450}
                className="w-full"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              <p className="text-muted-foreground mb-4">by {book.author}</p>

              <h2 className="text-2xl font-bold mb-2">{book.shelf}</h2>
              <p className="mb-6">
                <span>Total co. - {book.totalCopies}</span>
                <span className="mx-4">
                  Available co. - <span className="text-primary">{book.availableCopies}</span>
                </span>
              </p>

              <div className="flex gap-4 mb-8">
                <Link href={`/admin/issue?book=${params.id}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Issue to</Button>
                </Link>
                <Link href="/library">
                  <Button variant="outline" className="border-muted text-muted-foreground hover:text-foreground">
                    Go to Library
                  </Button>
                </Link>
              </div>

              <p className="text-muted-foreground mb-8">{book.description}</p>

              <div className="flex gap-8">
                <div className="bg-card rounded-md p-4 flex items-center justify-center flex-col">
                  <div className="text-2xl font-bold">01</div>
                  <div className="text-xs text-muted-foreground">352 Pages</div>
                </div>

                <div className="bg-card rounded-md p-4 flex items-center justify-center flex-col">
                  <div className="text-2xl">
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
                      className="lucide lucide-globe"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" x2="22" y1="12" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div className="text-xs text-muted-foreground">English</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Details</h2>

            <div className="overflow-hidden rounded-lg border border-muted">
              <div className="grid grid-cols-5 bg-card p-4 font-medium">
                <div>Book Id</div>
                <div>Last Issued on</div>
                <div>User Id</div>
                <div>Date of Submission</div>
                <div>Status</div>
              </div>

              {book.issueHistory.map((issue) => (
                <div key={issue.id} className="grid grid-cols-5 border-t border-muted p-4">
                  <div className="text-primary">{issue.id}</div>
                  <div>{issue.issuedOn}</div>
                  <div>{issue.userId}</div>
                  <div>{issue.submissionDate}</div>
                  <div className={issue.status === "Issued" ? "text-red-500" : "text-green-500"}>{issue.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

