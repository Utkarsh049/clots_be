# Clots Backend API

Backend API for the Clots notes app, built with Express + TypeScript + Prisma + PostgreSQL. It includes JWT auth, note CRUD with tags, search, public sharing, and S3-based image uploads.

## Features

- JWT authentication (`signup`, `login`, `profile`)
- Notes CRUD with optional image URL
- Tagging support with slug-based filtering
- Note search by title/content/tag
- Public note sharing via `shareId`
- AWS S3 upload endpoint for note images
- Global rate limiting and structured logging

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma Client + `@prisma/adapter-pg`
- PostgreSQL
- AWS SDK v3 (S3)
- Zod (request validation)

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=5000

# Database
# Example: postgresql://user:password@localhost:5432/clots_db?schema=public
DATABASE_URL="your_postgresql_connection_string"

# Auth
JWT_SECRET="your_super_secret_jwt_key"

# AWS S3
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
AWS_S3_BUCKET="your_bucket_name"
```

## Run Locally

1. Install dependencies:

```bash
pnpm install
```

2. Apply migrations:

```bash
npx prisma migrate dev
```

3. Start development server:

```bash
pnpm run dev
```

Default local API base URL: `http://localhost:5000`

## API Overview

All routes (except public/share and health routes) are protected with bearer token auth:

`Authorization: Bearer <token>`

### Utility

- `GET /` -> plain text: `Clots API running`
- `GET /health` -> service health payload

### Auth (`/auth`)

- `POST /auth/signup`
   - Body: `{ "name": string, "email": string, "password": string }`
   - Validation: `name` min 2, `password` min 6
- `POST /auth/login`
   - Body: `{ "email": string, "password": string }`
- `GET /auth/profile` (auth required)
   - Returns current user profile from token

### Notes (`/notes`) - Auth Required

- `POST /notes`
   - Body: `{ "title": string, "content": string, "imageUrl"?: string | null, "tags"?: string[] }`
- `GET /notes?page=1&limit=10`
   - Returns paginated notes: `{ notes, page, limit, total }`
- `GET /notes/:id`
- `PUT /notes/:id`
   - Body: any subset of `{ title, content, imageUrl, tags }`
- `DELETE /notes/:id`
   - Returns `204 No Content`

### Search and Tags (`/notes`) - Auth Required

- `GET /notes/search?q=keyword`
   - Note: query param is `q` (not `query`)
- `GET /notes/tag/:slug`

### Sharing

- `POST /notes/:id/share` (auth required)
   - Marks note as public (`isPublic = true`)
- `DELETE /notes/:id/share` (auth required)
   - Marks note as private (`isPublic = false`)
- `GET /share/:shareId` (public)
   - Returns only public notes by share id

### Upload (`/upload`) - Auth Required

- `POST /upload`
   - `multipart/form-data` with file key: `image`
   - Uploads to S3 and returns `{ message, imageUrl }`

## Notes on Behavior

- Rate limiter is enabled globally: `100` requests per `15` minutes per IP.
- `shareId` is generated at note creation and used when note is made public.
- Request validation errors return `400` with Zod error details.
