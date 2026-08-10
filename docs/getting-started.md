# Getting Started

## Prerequisites
- Node.js
- Docker (optional, but recommended for database via docker-compose)
- PostgreSQL (if not using Docker)

## Installation & Setup
1. Clone the repository
2. Run `npm install`
3. Configure your `.env` based on `.env.example`
4. Start the database (e.g., `docker compose up -d db`)
5. Run database migrations: `npx prisma migrate dev`
6. Start the Next.js development server: `npm run dev`
7. In a new terminal, start the Inngest dev server: `npx inngest-cli@latest dev`

For the full detailed setup, see the [Root README](../README.md#getting-started).
