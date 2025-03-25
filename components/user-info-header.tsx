import { User, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserInfoHeaderProps {
  name: string
  email: string
  isAdmin?: boolean
  className?: string
}

export function UserInfoHeader({ name, email, isAdmin = false, className }: UserInfoHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-border pb-4",
        className,
      )}
    >
      <div className="flex items-center mb-2 md:mb-0 gap-2">
        <User className="h-5 w-5 text-primary" />
        <span className="text-muted-foreground">Name:</span>
        <span className="text-foreground font-medium">{name}</span>
        {isAdmin && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-amber-600/20 text-amber-500 rounded-full border border-amber-600/30 font-medium">
            Admin
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <span className="text-muted-foreground">Email:</span>
        <span className="text-foreground font-medium">{email}</span>
      </div>
    </div>
  )
}

