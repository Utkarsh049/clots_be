# Clots Backend API

A robust backend service for the Clots notes application. It provides secure authentication, comprehensive note management with tagging and search, public note sharing, and AWS S3 integrated image uploads.

## Features

- **User Authentication**: Secure JWT-based signup and login.
- **Note Management**: Create, read, update, and delete notes.
- **Tagging System**: Organize notes with tags and filter by them.
- **Search & Pagination**: Search notes by title, content, or tags. Paginated endpoints for efficient data loading.
- **Public Note Sharing**: Share specific notes publicly and access them via a unique share URL.
- **Image Uploads**: Integrated AWS S3 image uploads for attaching media to notes.

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM / Database Tooling**: Prisma
- **Database**: PostgreSQL
- **Storage**: AWS S3 (for image uploads)

---

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the root directory:

```env
# Server
PORT=5000

# Database (Prisma)
# Example: postgresql://user:password@localhost:5432/clots_db?schema=public
DATABASE_URL="your_postgresql_connection_string"

# Authentication
# Secret key for signing JSON Web Tokens
JWT_SECRET="your_super_secret_jwt_key"

# AWS S3 Configuration (For Image Uploads)
AWS_REGION="ap-south-1" # Default region (change if needed)
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
AWS_S3_BUCKET="clots-images" # Your S3 bucket name
```

---

## 📡 API Endpoints Guide (For Frontend)

All API endpoints are prefixed with their respective base routes. Except for Auth and Public Share endpoints, **all requests require a standard Bearer Token** in the `Authorization` header (`Authorization: Bearer <token>`).

### Authentication (`/auth`)

- `POST /auth/signup` - Register a new user (requires `email`, `password`, `name`).
- `POST /auth/login` - Authenticate a user and receive a JWT token.

### Notes Management (`/notes`)

_Requires Authentication_

- `GET /notes` - Get all notes for the authenticated user (supports pagination parameters: `?page=1&limit=10`).
- `GET /notes/:id` - Get a specific note by its ID.
- `POST /notes` - Create a new note.
  - Body can include: `title` (string), `content` (string), `imageUrl` (string, optional), `tags` (array of strings, optional).
- `PUT /notes/:id` - Update an existing note.
- `DELETE /notes/:id` - Delete a note.

### Notes Search & Filtering (`/notes`)

_Requires Authentication_

- `GET /notes/search?query=...` - Search notes by title, content, or tag names (case-insensitive).
- `GET /notes/tag/:slug` - Get all notes associated with a specific tag slug.

### Sharing Notes (`/notes` & `/share`)

- `POST /notes/:id/share` - Make a note public (Requires Auth). Generates/Enables a `shareId`.
- `DELETE /notes/:id/share` - Make a note private again (Requires Auth).
- `GET /share/:shareId` - Get a publicly shared note (No Auth Required).

### File Uploads (`/upload`)

_Requires Authentication_

- `POST /upload` - Upload an image to AWS S3.
  - Send the file as multipart/form-data with the key `image`.
  - Returns the public S3 URL for the uploaded image.

## Getting Started

1. Clone the repository and navigate into the folder.
2. Install dependencies:
   ```bash
   pnpm install
   # or npm install / yarn install
   ```
3. Set up your `.env` file based on the template above.
4. Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev
   ```
5. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
6. Start the development server:
   ```bash
   pnpm run dev
   ```
