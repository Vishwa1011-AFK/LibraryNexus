import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { UserInfoHeader } from "@/components/user-info-header"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Book, FileText, Globe } from "lucide-react"

// This would normally come from a database
const book = {
  id: "1",
  title: "The Master Algorithm",
  author: "Pedro Domingos",
  description:
    "Machine learning is the automation of discovery, the scientific method on steroids, that enables intelligent robots and computers to program themselves. No field of science today is more important yet more shrouded in mystery. Pedro Domingos, one of the field's leading lights, lifts the veil for the first time to give us a peek inside the learning machines that power Google, Amazon, and your smartphone",
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
    { id: "XX345", issuedOn: "05-06-2024", userId: "5678901", submissionDate: "20-06-2024", status: "Submitted" },
    { id: "XX346", issuedOn: "01-06-2024", userId: "2468135", submissionDate: "15-06-2024", status: "Submitted" },
  ],
}

export default function AdminBookDetail({ params }: { params: { id: string } }) {
  // In a real app, this would come from your auth context
  const userData = {
    name: "Diwakar Dubey",
    email: "dd34@gmail.com",
    isAdmin: true,
  }

  const issueHistoryColumns = [
    {
      key: "id",
      header: "Book ID",
      cell: (issue: (typeof book.issueHistory)[0]) => <span className="text-primary">{issue.id}</span>,
      sortable: true,
    },
    {
      key: "issuedOn",
      header: "Last Issued on",
      cell: (issue: (typeof book.issueHistory)[0]) => issue.issuedOn,
      sortable: true,
    },
    {
      key: "userId",
      header: "User ID",
      cell: (issue: (typeof book.issueHistory)[0]) => issue.userId,
      sortable: true,
    },
    {
      key: "submissionDate",
      header: "Date of Submission",
      cell: (issue: (typeof book.issueHistory)[0]) => issue.submissionDate,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (issue: (typeof book.issueHistory)[0]) => (
        <Badge variant={issue.status === "Issued" ? "destructive" : "success"}>{issue.status}</Badge>
      ),
      sortable: true,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <UserInfoHeader name={userData.name} email={userData.email} isAdmin={userData.isAdmin} />

          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="text-lg font-medium">ISBN :</span>
              <span className="ml-4 text-lg text-primary">{book.isbn}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
            <div>
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              <p className="text-muted-foreground mb-4">by {book.author}</p>

              <h2 className="text-2xl font-bold mb-2">{book.shelf}</h2>
              <p className="mb-6 flex flex-wrap gap-4">
                <span>Total copies: {book.totalCopies}</span>
                <span>
                  Available copies: <span className="text-primary">{book.availableCopies}</span>
                </span>
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
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

              <div className="flex flex-wrap gap-8">
                <div className="bg-card rounded-md p-4 flex items-center justify-center flex-col">
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {book.pages}
                  </div>
                  <div className="text-xs text-muted-foreground">Pages</div>
                </div>

                <div className="bg-card rounded-md p-4 flex items-center justify-center flex-col">
                  <div className="text-2xl flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {book.language}
                  </div>
                  <div className="text-xs text-muted-foreground">Language</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Issue History
            </h2>

            <DataTable
              data={book.issueHistory}
              columns={issueHistoryColumns}
              pageSize={5}
              searchable
              searchKeys={["id", "userId"]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

