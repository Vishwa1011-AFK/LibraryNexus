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
      className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <Card
        className={cn("h-full overflow-hidden bg-card border-muted hover:bg-muted/80 transition-colors", className)}
      >
        <CardContent className="p-3">
          <div className="aspect-[2/3] relative mb-3 overflow-hidden rounded-md">
            <Image
              src={coverUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="font-medium line-clamp-1" title={title}>
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

          {rating !== undefined && <div className="text-xs text-muted-foreground">★ {rating}</div>}

          {available !== undefined && (
            <div
              className={cn(
                "text-center py-1 px-2 rounded-md text-xs w-full",
                available ? "bg-green-900/30 text-green-500" : "bg-red-900/30 text-red-500",
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

