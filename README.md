# santara

TBA

## Technologies Used

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **workers** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth

## Getting Started

First, install the dependencies:

```bash
bun install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
bun db:generate
bun db:migrate
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Before Deploying to Cloudflare

When you are ready to deploy your app to Cloudflare Workers, you'll have to make a couple changes.
- Change your url environment variables from localhost to your actual production domains in the following files:
```bash
# apps/web/.env
SERVER_URL={your-production-server-domain}
```

- Change custom domain settings in the following files:
```bash
# apps/web/wrangler.jsonc
"routes": [
    {
      "pattern": "{your-production-web-domain}",
      "custom_domain": true
    }
  ]
```

```bash
# apps/server/wrangler.jsonc
"routes": [
    {
      "pattern": "{your-production-server-domain}",
      "custom_domain": true
    }
  ]
```

- Update authentication cookie settings in `packages/auth/src/index.ts` to enable cross-subdomain cookies and cookie caching for production. (optional but recommended for better user experience).

- Put your server production secret from `.env` file in your Cloudflare Workers secrets:
```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put DATABASE_URL
wrangler secret put CORS_ORIGIN
```


## Deployment (Cloudflare Wrangler)
- Web deploy: cd apps/web && bun deploy
- Server deploy: cd apps/server && bun deploy


## Project Structure

```
santara/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono, ORPC)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```
