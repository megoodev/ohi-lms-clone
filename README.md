# LMS — Learning Management System

This repository contains a Next.js 15 application implementing a learning management platform (LMS) with admin tooling, course creation and editing, S3-backed media uploads, Prisma (Postgres) data models, authentication, and Stripe payments.

The README below provides a project overview, local setup instructions, important environment variables, and developer notes to help contributors get started.

---

## Quick overview

- Framework: Next.js (App Router)
- Language: TypeScript + React 19
- DB: PostgreSQL accessed with Prisma
- File storage: S3-compatible object storage (presigned uploads)
- Auth: `better-auth` (server + client usage via `authClient`), social login (GitHub) and email OTP
- Payments: Stripe (checkout + webhook)
- Email: Resend (transactional deliveries)
- Other major libs: Zod (validation), React Hook Form, TipTap editor, Radix UI + Tailwind


## Key features

- Public site for browsing courses and course detail pages
- Admin area to create/edit/delete courses, chapters and lessons
- Lesson progress tracking and user enrollments (Prisma models included)
- Image/video upload via presigned S3 URLs (PUT requests from client)
- Stripe payment flow with webhook to create enrollments
- Basic rate-limiting/protection with Arcjet on sensitive API routes


## Repo structure (important folders)

- `src/app` — Next.js App Router routes and pages (server and client components)
- `src/components` — UI components and shared UI building blocks
- `src/lib` — utilities, S3 client, auth, db, and types
- `src/data` — server data-access layer and route helpers (admin, course, user)
- `src/generated/prisma` — Prisma client (generated)
- `prisma` — Prisma schema and migrations


## Running locally (development)

Prerequisites: Node.js (18+), a Postgres database accessible from your machine (or Neon), and an S3-compatible bucket / endpoint for uploads.

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client and apply migrations (development)

```bash
npx prisma generate
# if you need to create dev migrations and apply them:
npx prisma migrate dev --name init
```

3. Create a `.env` file with the required environment variables (see the list below). Do NOT commit secrets to git.

4. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000


## Required environment variables

Create a `.env` (not committed) and provide the following variables. Do NOT copy any values you see in this repo — replace them with your own secrets.

- `BETTER_AUTH_SECRET` — secret for better-auth
- `BETTER_AUTH_URL` — base url for auth callbacks (e.g. `http://localhost:3000`)
- `DATABASE_URL` — Postgres connection string for Prisma
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` — GitHub OAuth app credentials
- `RESEND_API_KEY` — API key for Resend (email)
- `ARCJET_KEY` — Arcjet API key (rate limiting / protection)
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` — credentials for S3-compatible storage
- `AWS_ENDPOINT_URL_S3` and `AWS_ENDPOINT_URL_IAM` — custom S3 endpoints (if using alternative provider)
- `AWS_REGION` — region or `auto` for custom endpoints
- `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES` — bucket name used for image storage (public usage)
- `STRIPE_WEBHOOK_SECRET` and `STRIPE_SEKERT_KEY` — Stripe webhook secret and secret key

Note: keep these values private. The repository previously contained an example `.env` with real-looking secrets — replace all with your own.


## Database & Prisma

- The Prisma schema is in `prisma/schema.prisma`. Models include `User`, `Course`, `Chapter`, `lesson` (note lowercase model name), `Enrollment`, and `LessonProgress`.
- When changing the schema, run `npx prisma migrate dev` to create and apply migrations, and `npx prisma generate` to regenerate the client.


## Media uploads (S3) and CORS

- The client requests a presigned PUT URL from `POST /api/s3/upload` and then PUTs the file directly to the storage endpoint.
- If you see CORS errors when uploading from the browser, you must configure the bucket's CORS rules to allow your origin and PUT requests (or switch to presigned POST form uploads to avoid preflight).


## Auth and admin protection

- Server routes that require admin use a `requireAdmin` helper which checks the session and redirects if unauthorized.
- Client usage of auth is via `authClient` stored in `src/lib/auth-client.ts`.


## Stripe payments

- Server webhook handling is implemented in `src/app/api/webhook/stripe/route.ts` and expects `STRIPE_WEBHOOK_SECRET`.


## Linting / Type-checking / Build

- Development server: `npm run dev` (Next.js dev)
- Production build: `npm run build` then `npm start`
- Lint: `npm run lint`


## Known gotchas & developer notes

- Do not commit `.env` with secrets. Use environment secrets for CI and production.
- S3 CORS must be configured to allow the web origin and PUT method. If you encounter `No 'Access-Control-Allow-Origin' header is present`, update your bucket CORS rules.
- Some pages are client components (contain `"use client"`) — metadata must be provided in server components or `generateMetadata` functions; avoid exporting `metadata` from client components.
- The project uses Zod with `z.coerce.number()` for numeric fields — when using `react-hook-form` with the Zod resolver, the resolver may need to be typed as `Resolver<CourseSChemaType>` to avoid TypeScript mismatches.


## Contributing

- Create a branch, implement changes, run tests/build locally, and open a PR with a clear description.


## Useful commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
npm run build
```


## Next steps / Improvements

- Add unit and integration tests (Jest / Playwright)
- Improve upload UX to show existing S3-hosted files in the edit form by building public URLs or returning `initialUrl` from the server
- Add CI workflow for linting, type-checking, and preview deployments


---

If you want, I can also:

- add a `docs/` folder with architecture diagrams and an env template `.env.example` (without secrets), or
- implement presigned POST upload flow to avoid CORS preflight issues.

Which of those would you like me to do next?
