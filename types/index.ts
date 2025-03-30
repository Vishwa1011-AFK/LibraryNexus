export interface User {
  id: string;
  _id?: string;
  role: 'student' | 'admin';
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  email_verified?: boolean;
  birthDate?: string | Date;
  recentLoans?: any[];
}

export interface AuthUser extends User {
 isAdmin: boolean;
}

export interface Book {
  id: string;
  _id?: string;
  added?: string | Date;
  title: string;
  author: string;
  isbn: string;
  cover?: string;
  coverUrl?: string;
  category?: string;
  publishDate?: string;
  location?: string;
  shelf?: string;
  pages?: number;
  language?: string;
  publisher?: string;
  description?: string;
  featured?: boolean;
  available?: boolean;
  totalCopies?: number;
  availableCopies?: number;
  rating?: number;
  issueHistory?: AdminIssueHistoryItem[];
}

export interface BooksApiResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BorrowedBook {
loanId: string;
book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    coverUrl?: string;
    category?: string;
    location?: string;
    publishDate?: string;
} | null;
issueDate: string | Date;
dueDate: string | Date;
}

export interface WishlistItem {
id: string
title: string
author: string
isbn: string
coverUrl?: string
category?: string
addedAt: string | Date
}

export interface WishlistApiResponse {
userId: string
books: WishlistItem[]
}

export interface SignupPayload {
firstName: string;
middleName?: string;
lastName: string;
email: string;
password?: string;
birthDate?: string;
}

export interface ReadingHistoryItem {
loanId: string;
book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    coverUrl?: string;
    category?: string;
} | null;
issueDate: string | Date;
completedDate: string | Date;
}

export interface ReadingHistoryApiResponse {
history: ReadingHistoryItem[];
total: number;
page: number;
totalPages: number;
}

export interface SignInResponse {
  accessToken: string
  msg: string
  user: {
      user_id: string
      role: 'student' | 'admin'
  }
  userdetails: {
      firstName: string
      middleName?: string
      lastName: string
      email: string
      birthDate?: string
  }
}

export interface AdminStats {
  totalBooks: number;
  activeBorrows: number;
  overdue: number;
  newThisMonth: number;
}

export interface AdminIssueHistoryItem {
  id: string;
  issuedOn: string | Date;
  userId: string;
  user?: { name?: string; email?: string };
  userName?: string;
  userEmail?: string;
  submissionDate?: string | Date;
  returnedDate?: string | Date;
  status: 'Issued' | 'Returned' | 'Overdue' | 'Submitted';
}

export interface AdminIssueHistoryApiResponse {
  history: AdminIssueHistoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponseWithMessage {
  success: boolean;
  message: string;
  [key: string]: any; 
}

export interface AdminUsersApiResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}