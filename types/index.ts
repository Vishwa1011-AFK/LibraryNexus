export interface User {
    id: string;
    role: 'student' | 'admin';
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    email_verified?: boolean;
    birthDate?: string | Date;
  }
  
export interface AuthUser extends User {
   isAdmin: boolean;
}

export interface Book {
    id: string;
    _id: string;
    title: string;
    author: string;
    isbn: string;
    cover?: string;
    coverUrl?: string;
    category?: string;
    publishDate?: string;
    location?: string;
    pages?: number;
    language?: string;
    publisher?: string;
    description?: string;
    featured?: boolean;
    available?: boolean;
    rating?: number;
}

export interface BooksApiResponse {
    books: Book[];
    total: number;
    page: number;
    totalPages: number;
}
