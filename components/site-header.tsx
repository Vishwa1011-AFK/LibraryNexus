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
        "flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-muted pb-4",
        className,
      )}
    >
      <div className="flex items-center mb-2 md:mb-0">
        <span className="text-lg">Name</span>
        <span className="mx-4 text-xl">:</span>
        <span className="text-lg">{name}</span>
        {isAdmin && <span className="ml-2 px-2 py-1 text-xs bg-orange-600 rounded text-white">Admin</span>}
      </div>
      <div className="flex items-center">
        <span className="text-lg">Email ID</span>
        <span className="mx-4 text-xl">:</span>
        <span className="text-lg">{email}</span>
      </div>
    </div>
  )
}

