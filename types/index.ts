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
  