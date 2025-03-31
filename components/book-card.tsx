import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BookCardProps {
  id: number | string
  title: string
  author: string
  coverUrl: string
  category?: string
  rating?: number
  available?: boolean
  isAdmin?: boolean
  className?: string
}

export function BookCard({
  id,
  title,
  author,
  coverUrl,
  category,
  rating,
  available,
  isAdmin = false,
  className,
}: BookCardProps) {
  return (
    <Link
      href={isAdmin ? `/admin/books/${id}` : `/books/${id}`}
      className="block transition-transform hover:scale-102 focus:outline-none focus:ring-0"
    >
      <Card
        className={cn(
          "h-full overflow-hidden border-border hover:border-primary/50 transition-colors duration-200",
          className,
        )}
      >
        <CardContent className="p-3">
          <div className="aspect-[2/3] relative mb-3 overflow-hidden rounded-md shadow-sm">
            <Image
              src={coverUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ transition: "opacity 0.3s ease-in-out" }}
            />
          </div>
          <h3 className="font-medium line-clamp-1 text-foreground" title={title}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" title={author}>
            {author}
          </p>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          {category && (
            <Badge variant="outline" className="bg-secondary text-xs">
              {category}
            </Badge>
          )}

          {rating !== undefined && <div className="text-xs text-amber-500">★ {rating}</div>}

          {available !== undefined && (
            <div
              className={cn(
                "text-center py-1 px-2 rounded-md text-xs w-full font-medium",
                available ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive",
              )}
            >
              {available ? "Available" : "Unavailable"}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

