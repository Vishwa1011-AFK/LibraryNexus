# LibraryNexus - Digital Library Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-brightgreen)](https://library-nexus.vercel.app)

LibraryNexus is a comprehensive digital library management system designed specifically for educational institutions, with initial support tailored for IIITM via email domain validation. The platform provides an intuitive interface for students and faculty to browse, borrow, and manage books, while empowering administrators with robust tools to oversee the entire library inventory and user activity.

![LibraryNexus Home Page](./screenshots/home-page.png)

## Table of Contents

- [Demo](#demo)
- [Features](#features)
  - [User Features](#user-features)
  - [Admin Features](#admin-features)
- [Technology Stack](#technology-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Core Database Models](#core-database-models)
- [User Interface Highlights](#user-interface-highlights)
  - [User Dashboard](#user-dashboard)
  - [Book Catalog](#book-catalog)
  - [Book Details](#book-details)
  - [Admin Dashboard](#admin-dashboard)
  - [Admin Book Management](#admin-book-management)
- [Authentication System](#authentication-system)
- [API Routes Overview](#api-routes-overview)
  - [Authentication Routes](#authentication-routes)
  - [Book Routes](#book-routes)
  - [User Routes](#user-routes)
  - [Wishlist Routes](#wishlist-routes)
  - [Admin Routes](#admin-routes)
- [Security Implementation](#security-implementation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Demo

Explore the live version of LibraryNexus:
[**LibraryNexus Demo**](https://library-nexus.vercel.app)

## Features

### User Features

-   **Secure Authentication:** Sign in, sign up with IIITM email validation and verification.
-   **Intuitive Book Browsing:** Easily search, filter by category/author, and explore the library catalog.
-   **Detailed Book Information:** Access comprehensive details for each book, including description, author, publisher, and availability.
-   **Seamless Borrowing System:** Check out available books and keep track of due dates.
-   **Personalized Reading History:** View a complete history of currently borrowed and previously read books.
-   **Convenient Wishlist:** Save books of interest for future borrowing or reference.
-   **User Dashboard:** Get a personalized overview of borrowing activity, due dates, and wishlist items.

### Admin Features

-   **Comprehensive Inventory Management:** Add new books, edit existing details, and remove books from the catalog.
-   **User Oversight:** View registered user details and manage user accounts (e.g., roles, status).
-   **Efficient Loan Processing:** Issue books to users, process returns, and monitor overdue loans.
-   **Insightful Analytics Dashboard:** Track key library metrics like popular books, borrowing trends, and user engagement.
-   **Featured Book Management:** Highlight specific books on the homepage or catalog.

![Admin Dashboard](./screenshots/admin-dashboard.png)

## Technology Stack

### Frontend

-   **Framework**: [Next.js](https://nextjs.org/) (React) - For server-side rendering, static site generation, and a great developer experience.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) - Utility-first CSS framework combined with beautifully designed, accessible components.
-   **State Management**: React Context API & Hooks - For managing global and local state efficiently.
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) - Performant, flexible forms with robust schema validation.
-   **UI Primitives**: [Radix UI](https://www.radix-ui.com/) - Foundational, unstyled, accessible UI components.
-   **Icons**: [Lucide React](https://lucide.dev/) - Simply beautiful open-source icons.

### Backend

-   **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime environment.
-   **Framework**: [Express.js](https://expressjs.com/) - Minimalist and flexible Node.js web application framework.
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM - NoSQL database for flexible data storage and an elegant object data modeling library.
-   **Authentication**: JSON Web Tokens (JWT) - Secure access and refresh token strategy.
-   **Email Service**: [Nodemailer](https://nodemailer.com/) - For sending verification emails (e.g., OTPs).
-   **Security**: [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) - For secure password hashing.
-   **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation for API inputs.

## Architecture

The system follows a standard client-server architecture with a distinct frontend and backend communicating via a RESTful API.

![Architecture Diagram](./screenshots/architecture-diagram.png)

## Installation

Follow these steps to set up LibraryNexus locally for development.

### Prerequisites

-   Node.js (v18.0.0 or later recommended)
-   npm, yarn, or pnpm package manager
-   Git version control
-   A running MongoDB instance (local or cloud-based like MongoDB Atlas)
-   An email service provider account (e.g., Gmail with App Password, SendGrid, Mailgun) for Nodemailer.

### Frontend Setup

1.  **Clone the Frontend Repository:**
    ```bash
    # Replace <your-github-username> with your actual username
    git clone https://github.com/Vishwa1011-AFK/LibraryNexus.git
    cd library-nexus
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of the `library-nexus` directory with the following content. **Do not commit this file to version control.**
    ```env
    # URL of your running backend API server
    NEXT_PUBLIC_API_URL=http://localhost:5000/api

    # The base URL where your frontend application will run
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```
    *(Consider creating a `.env.example` file to track required variables.)*

4.  **Start the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The frontend should now be running on `http://localhost:3000`.

### Backend Setup

1.  **Clone the Backend Repository:**
    ```bash
    # Replace <your-github-username> with your actual username
    # Ensure this path is correct for your backend repository
    git clone https://github.com/Vishwa1011-AFK/LibraryNexus-Backend
    cd library-nexus-backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the `library-nexus-backend` directory. Populate it with your specific configuration. **Keep this file secure and do not commit it.**
    ```env
    # Server Port
    PORT=5000

    # MongoDB Connection String (replace with your actual URI)
    MONGODB_URI=your_mongodb_connection_string

    # JWT Secrets (use strong, random strings)
    ACCESS_TOKEN_SECRET=your_super_secret_jwt_access_token_key
    REFRESH_TOKEN_SECRET=your_even_more_secret_jwt_refresh_token_key

    # Email Service Configuration (for Nodemailer)
    EMAIL_SERVICE=smtp.example.com # e.g., smtp.gmail.com for Gmail
    EMAIL_USER=your_email@example.com
    EMAIL_PASSWORD=your_email_app_password_or_key # Use App Password for Gmail

    # Special code required for initial admin signup (choose a secure code)
    ADMIN_SIGNUP_CODE=your_secret_admin_signup_code

    # Timezone for date operations (e.g., loan due dates)
    TIMEZONE=Asia/Kolkata

    # Add other necessary variables like CORS_ORIGIN if needed
    # CORS_ORIGIN=http://localhost:3000
    ```
    *(Strongly recommend creating a `.env.example` file listing required variables without their values.)*

4.  **Start the Backend Server:**
    ```bash
    # For development with automatic restarts (if nodemon is configured)
    npm run dev

    # Or to run directly with Node
    # npm start
    ```
    The backend API should now be running on `http://localhost:5000`.

## Core Database Models

The application's data is organized around the following Mongoose models:

-   **User:** Stores user profile information (name, email, role), hashed passwords, verification status, and references to related data (loans, wishlist).
-   **Book:** Contains metadata about each unique book title (ISBN, title, author, publisher, description, categories, cover image URL).
-   **BookInventory:** Tracks individual copies of books, including their physical status (available, borrowed, damaged) and unique library identifier. Links to the `Book` model.
-   **Loan:** Records borrowing transactions, linking a `User`, a `BookInventory` item, borrow date, due date, and return status.
-   **Wishlist:** Manages lists of books users want to borrow, linking a `User` to multiple `Book` entries.
-   **RefreshToken:** Stores active refresh tokens associated with users for persistent sessions.

![Database Schema](./screenshots/database-schema.png)

## User Interface Highlights

### User Dashboard

A central hub for users to view their current loans, overdue books, reading history, and wishlist items at a glance.
![User Dashboard](./screenshots/user-dashboard.png)

### Book Catalog

An engaging interface for browsing, searching, and filtering the library's collection.
![Book Catalog](./screenshots/book-catalog.png)

### Book Details

Provides comprehensive information about a selected book, including availability and borrowing options.
![Book Details](./screenshots/book-details.png)

### Admin Dashboard

Offers administrators key statistics and quick access to management functions. (See screenshot near top)

### Admin Book Management

Allows administrators to efficiently add, update, or remove books and manage inventory copies.
![Admin Book Management](./screenshots/admin-book-management.png)

## Authentication System

LibraryNexus employs a robust JWT-based authentication system:

-   **Access Tokens:** Short-lived (e.g., 15 minutes) tokens sent in the `Authorization` header for accessing protected API routes.
-   **Refresh Tokens:** Longer-lived (e.g., 30 days) tokens stored securely in HTTP-only cookies and also persisted in the database (`RefreshToken` model). Used to obtain new access tokens without requiring the user to log in again.
-   **Email Verification:** Ensures user authenticity during signup using One-Time Passwords (OTPs) sent via email (powered by Nodemailer).

## API Routes Overview

The backend exposes a RESTful API. Key route groups include:

### Authentication Routes (`/api/auth`)

-   `POST /signup`: Register a new user (student/faculty based on email).
-   `POST /signin`: Log in a user and issue tokens.
-   `POST /token`: Use a valid refresh token to get a new access token.
-   `POST /logout`: Invalidate the refresh token.
-   `POST /verify-signup`: Verify the user's email using an OTP.
-   `POST /admin/signup`: Register an admin user (requires `ADMIN_SIGNUP_CODE`).

### Book Routes (`/api/books`, `/api/categories`, `/api/authors`)

-   `GET /books`: Search, filter, and paginate books.
-   `GET /books/:id`: Retrieve details for a specific book.
-   `GET /categories`: List all available book categories.
-   `GET /authors`: List all unique book authors.

### User Routes (`/api/users`)

-   `GET /me`: Get the profile of the currently authenticated user.
-   `PATCH /me`: Update the profile of the currently authenticated user.
-   `GET /me/borrowed-books`: List books currently borrowed by the user.
-   `GET /me/reading-history`: List all books ever borrowed by the user.

### Wishlist Routes (`/api/users/wishlist`)

-   `GET /me`: Get the current user's wishlist.
-   `POST /me/:bookId`: Add a book to the wishlist.
-   `DELETE /me/:bookId`: Remove a book from the wishlist.

### Admin Routes (`/api/admin`)

-   `GET /dashboard-stats`: Fetch statistics for the admin dashboard.
-   `GET /books`: List all books (admin view with inventory details).
-   `POST /books`: Add a new book and its initial inventory.
-   `PUT /books/:id`: Update book details.
-   `DELETE /books/:id`: Remove a book (consider soft delete).
-   `POST /books/:bookId/inventory`: Add more copies of an existing book.
-   `PUT /inventory/:inventoryId`: Update the status of a specific book copy.
-   `GET /loans`: List all loans (filterable).
-   `POST /loans/issue`: Issue a book to a user.
-   `POST /loans/return`: Mark a borrowed book as returned.
-   `GET /users`: List all registered users.
-   `PATCH /users/:userId`: Update user details (e.g., role, status).

## Security Implementation

Security is a priority:

-   **Password Hashing:** User passwords are securely hashed using `bcrypt.js` before storing.
-   **JWT Security:** Short access token lifespan minimizes impact if compromised. Refresh tokens stored in HTTP-only cookies mitigate XSS attacks.
-   **Input Validation:** Zod schemas rigorously validate incoming API request data on the backend.
-   **Rate Limiting:** (Recommended) Implement rate limiting on sensitive endpoints (like login) to prevent brute-force attacks.
-   **HTTPS:** (Essential for Production) Ensure deployment uses HTTPS to encrypt communication.
-   **Role-Based Access Control (RBAC):** Middleware checks user roles (user, admin) to authorize access to specific API routes.
-   **Environment Variable Security:** Sensitive keys and credentials stored in environment variables, not committed to code.

## Contributing

Contributions are welcome! If you'd like to improve LibraryNexus, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository locally (`git clone https://github.com/your-username/library-nexus.git`).
3.  Create a new **branch** for your feature or bug fix (`git checkout -b feature/your-amazing-feature` or `bugfix/issue-description`).
4.  Make your **changes** and **commit** them with clear, descriptive messages (`git commit -m 'feat: Add functionality for X'`).
5.  **Push** your changes to your forked repository (`git push origin feature/your-amazing-feature`).
6.  Open a **Pull Request** (PR) from your branch to the main repository's `main` branch.
7.  Clearly describe your changes in the PR and link any relevant issues.

Please ensure your code adheres to the project's coding style and includes tests where applicable.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for full details.

## Acknowledgements

LibraryNexus was built using these fantastic open-source projects:

-   [Next.js](https://nextjs.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Radix UI](https://www.radix-ui.com/)
-   [shadcn/ui](https://ui.shadcn.com/)
-   [React Hook Form](https://react-hook-form.com/)
-   [Zod](https://zod.dev/)
-   [Lucide React](https://lucide.dev/)
-   [Node.js](https://nodejs.org/)
-   [Express.js](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Mongoose](https://mongoosejs.com/)
-   [Nodemailer](https://nodemailer.com/)
-   [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
-   [JWT](https://jwt.io/)

And thanks to the broader open-source community!
