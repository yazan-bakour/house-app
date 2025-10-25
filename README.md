# Nuxt Minimal Starter

This project is a full stack web application for House listing. built with Turso DB, VueJs, Nuxt 4, Typescript, SCSS, and Vite. 

## Setup

Make sure to install dependencies:

```bash

pnpm install

## Development Server

Start the development server on `http://localhost:3000`:

```bash

pnpm dev

```

## Production

Build the application for production:

```bash

pnpm build

```

Locally preview production build:

```bash

pnpm preview

```

## Environment Variables

To run this project, you must create a `.env` file in the project root with the following variables:

```bash
# Turso Database Configuration
TURSO_DB_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# Vercel Blob Storage (auto-generated when deployed to Vercel)
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here

# Cron Job Security (generate a random string)
CRON_SECRET=your_random_cron_secret_here
```

### Setup Turso Database

1. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Sign up: `turso auth signup`
3. Create database: `turso db create house-app`
4. Get database URL: `turso db show house-app --url`
5. Create auth token: `turso db tokens create house-app`
6. Add credentials to `.env` file

### Push Database Schema

```bash
pnpm db:push
```

### Seed Database with Default Houses

```bash
pnpm db:seed
```

### Vercel Blob Storage

When deployed to Vercel, the `BLOB_READ_WRITE_TOKEN` is automatically configured. For local development, you can create a test token from your Vercel project settings.
