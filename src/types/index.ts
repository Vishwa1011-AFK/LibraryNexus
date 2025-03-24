export type BookStatus = "available" | "borrowed" | "reserved" | "overdue" | "returned"
export type UserRole = "admin" | "member"
export type UserStatus = "active" | "inactive"
export type TransactionStatus = "active" | "overdue" | "returned" | "pending"

export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  status: BookStatus
  description?: string
  publishedDate?: string
  pages?: number
  genre?: string
  rating?: number
  isbn?: string
  publisher?: string
  language?: string
  copies?: number
  availableCopies?: number
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinDate: string
  booksCheckedOut: number
}

export interface Transaction {
  id: string
  userId: string
  user?: string
  bookId: string
  book?: string
  borrowDate?: string
  dueDate?: string
  returnDate?: string
  reserveDate?: string
  availableDate?: string
  status: TransactionStatus
}

