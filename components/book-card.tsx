import Image from "next/image"
import Link from "next/link"

type BookStatus = "available" | "borrowed" | "reserved"

interface BookCardProps {
  id: string
  title: string
  author: string
  coverUrl: string
  status: BookStatus
  isAdmin?: boolean
}

export function BookCard({ id, title, author, coverUrl, status, isAdmin = false }: BookCardProps) {
  const basePath = isAdmin ? "/admin" : ""

  const statusClass =
    status === "available" ? "status-available" : status === "borrowed" ? "status-borrowed" : "status-reserved"

  return (
    <Link href={`${basePath}/books/${id}`} className="group">
      <div className="book-cover">
        <Image
          src={coverUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className={`book-status ${statusClass}`} />
      </div>
      <div className="mt-2">
        <h3 className="font-medium line-clamp-1 text-sm">{title}</h3>
        <p className="text-muted-foreground text-xs">{author}</p>
      </div>
    </Link>
  )
}

