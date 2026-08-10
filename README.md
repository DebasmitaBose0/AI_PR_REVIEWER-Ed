# 🚀 [**AI_PR_REVIEWER**](https://github.com/AnitSarkar123/AI_PR_REVIEWER)

AI-powered GitHub code review platform that automatically reviews pull requests, provides actionable feedback, tracks repository activity, and helps developers maintain code quality.

---

## ✨ Features

### 🤖 AI Code Reviews

- Automatic pull request analysis
- AI-generated review comments
- Review history tracking
- PR quality insights

### 📦 Repository Management

- Connect GitHub repositories
- Search and manage repositories
- Repository activity tracking
- GitHub integration

### 📊 Dashboard & Analytics

- Contribution heatmap
- Commit statistics
- Pull request metrics
- Monthly activity reports

### 🔐 Authentication

- Secure GitHub authentication
- Session management
- Protected routes

### 💳 Subscription System

- Free and Pro plans
- Usage limits
- Subscription management
- Billing integration

### ⚡ Background Processing

- Automated repository indexing
- Asynchronous review generation
- Webhook handling
- Event-driven workflows

---

## 🏗️ Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- Recharts

### Backend

- Next.js Server Actions
- Prisma ORM
- PostgreSQL
- Better Auth

### AI & Integrations

- Google AI SDK
- OpenAI Compatible SDK
- GitHub API
- Pinecone Vector Database

### Infrastructure

- Inngest
- Polar Payments
- GitHub Webhooks

---

## 📂 Project Structure

```text
Repository
└──ai_pr_reviewer/
    ├── .env.example
    ├── .gitignore
    ├── README.md
    ├── CONTRIBUTING.md
    ├── SECURITY.md
    ├── CODE_OF_CONDUCT.md
    ├── components.json
    ├── css.d.ts
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── prisma.config.ts
    ├── tsconfig.json
    ├── bun.lock
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (auth)/
    │   │   └── login/
    │   │       └── page.tsx
    │   ├── api/
    │   │   ├── auth/
    │   │   │   └── [...all]/
    │   │   │       └── route.ts
    │   │   ├── inngest/
    │   │   │   └── route.ts
    │   │   └── webhooks/
    │   │       └── github/
    │   │           └── route.ts
    │   └── dashboard/
    │       ├── layout.tsx
    │       ├── page.tsx
    │       ├── repository/
    │       │   └── page.tsx
    │       ├── reviews/
    │       │   └── page.tsx
    │       ├── settings/
    │       │   └── page.tsx
    │       └── subscriptions/
    │           └── page.tsx
    ├── components/
    │   ├── app-sidebar.tsx
    │   ├── providers/
    │   │   ├── query-provider.tsx
    │   │   ├── theme-provider.tsx
    │   │   └── toaster-provider.tsx
    │   └── ui/ (40+ shadcn components)
    ├── hooks/
    │   ├── use-mobile.ts
    │   └── use-unsaved-changes.ts
    ├── inngest/
    │   ├── client.ts
    │   └── functions/
    │       ├── index.ts
    │       └── review.ts
    ├── lib/
    │   ├── auth-client.ts
    │   ├── auth.ts
    │   ├── db.ts
    │   ├── pinecone.ts
    │   ├── utils.ts
    │   ├── webhook-verify.ts
    │   └── generated/prisma/
    ├── module/
    │   ├── ai/
    │   │   ├── actions/index.ts
    │   │   └── lib/rag.ts
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── login-ui.tsx
    │   │   │   └── logout.tsx
    │   │   └── utils/auth-utils.ts
    │   ├── dashboard/
    │   │   ├── actions/
    │   │   │   ├── index.ts
    │   │   │   └── recent-activity.ts
    │   │   └── components/
    │   │       ├── contribution-graph.tsx
    │   │       └── recent-activity-card.tsx
    │   ├── github/
    │   │   └── lib/
    │   │       ├── github.ts
    │   │       ├── token.ts
    │   │       ├── webhook.ts
    │   │       └── contributions.ts
    │   ├── payment/
    │   │   ├── actions/index.ts
    │   │   ├── config/polar.ts
    │   │   └── lib/subscription.ts
    │   ├── repository/
    │   │   ├── actions/index.ts
    │   │   ├── components/repository-skeleton.tsx
    │   │   └── hooks/
    │   │       ├── use-connect-repository.ts
    │   │       └── use-repositories.ts
    │   ├── review/
    │   │   └── actions/index.ts
    │   └── settings/
    │       ├── actions/index.ts
    │       └── components/
    │           ├── profile-form.tsx
    │           └── repository-list.tsx
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    │       ├── migration_lock.toml
    │       ├── 20260329133431_test/
    │       ├── 20260329135849_authentication/
    │       ├── 20260402162416_repository_model_added/
    │       ├── 20260413093751_added_review_and_userusage/
    │       ├── 20260417153032_update/
    │       └── 20260426154209_added_polar_ids/
    ├── public/
    └── .github/
        ├── ISSUE_TEMPLATE/
        │   ├── bug_report.md
        │   ├── documentation.md
        │   └── feature_request.md
        └── PULL_REQUEST_TEMPLATE.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed and ready:

- [Node.js](https://nodejs.org/) v20 or higher
- [PostgreSQL](https://www.postgresql.org/) (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))
- [Git](https://git-scm.com/)
- A [GitHub OAuth App](https://github.com/settings/developers) (for authentication + API access)
- A [Pinecone](https://www.pinecone.io/) account (vector database for RAG-based reviews)
- An AI provider API key — any OpenAI-compatible provider (e.g. [Google AI Studio](https://aistudio.google.com/), [OpenRouter](https://openrouter.ai/), OpenAI)
- A [Polar.sh](https://polar.sh/) account (for subscription/billing)

---

### 1. Clone the Repository

```bash
git clone https://github.com/AnitSarkar123/AI_PR_REVIEWER.git
cd AI_PR_REVIEWER
```

---

### 2. Install Dependencies & Setup Environment

```bash
# Install package dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create local environment configuration
cp .env.example .env
```

---

### 3. Verification & Build Commands

```bash
# Run Next.js production build check
npm run build

# Run linting check
npm run lint
```

1. Go to [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client Secret**

---

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then fill in all values:

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/ai_pr_reviewer

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# GitHub OAuth App (from Step 3)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Provider — any OpenAI-compatible API
# e.g. Google AI Studio base URL: https://generativelanguage.googleapis.com/v1beta/openai
OPENAI_COMPATIBLE_API_KEY=your_api_key
OPENAI_COMPATIBLE_BASE_URL=https://api.openai.com/v1
OPENAI_COMPATIBLE_MODEL=gpt-4o

# Pinecone — create an index at https://app.pinecone.io
PINECONE_DB_API_KEY=your_pinecone_api_key

# Better Auth — generate a random secret: openssl rand -base64 32
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000

# Polar.sh — from your Polar dashboard
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret
POLAR_SUCCESS_URL=http://localhost:3000/dashboard/subscriptions

# Inngest (auto-detected locally, but set for production)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

### 5. Set Up the Database

Run Prisma migrations to create all tables:

```bash
npx prisma migrate dev
```

Optionally, open Prisma Studio to inspect your database:

```bash
npx prisma studio
```

---

### 6. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

### 7. Configure GitHub Webhook

For AI reviews to trigger automatically on pull requests:

1. Go to your target GitHub repository → **Settings → Webhooks → Add webhook**
2. Set:
   - **Payload URL:** `https://your-domain.com/api/webhooks/github`
     _(use [ngrok](https://ngrok.com/) for local testing: `ngrok http 3000`)_
   - **Content type:** `application/json`
   - **Events:** Select **Pull requests**
3. Save the webhook

Once configured, opening or updating a PR will automatically trigger an AI review.

---

### 8. Start the Inngest Dev Server

Inngest handles background jobs like automated PR review generation. You need to run it alongside the Next.js dev server.
In a separate terminal, run:

```bash
npx inngest-cli@latest dev
```

This starts the Inngest dev server at http://localhost:8288 and connects to your Next.js app at http://localhost:3000/api/inngest.
You can open the Inngest dashboard at http://localhost:8288 to monitor and replay background functions.

> [!note]
> Both servers must be running simultaneously — npm run dev in one terminal and npx inngest-cli@latest dev in another.

---

## 🔄 Workflow

1. Sign in with GitHub.
2. Connect repositories.
3. Configure GitHub webhook.
4. Open or update a Pull Request.
5. CodeHorse automatically:

   - Receives webhook events
   - Fetches PR changes
   - Generates AI review
   - Stores review results

6. View reviews from the dashboard.

---

## 📸 Screenshots

Add screenshots here:
<img width="1536" height="826" alt="image" src="https://github.com/user-attachments/assets/5385d29f-4674-4e0a-8844-707ae5872b6b" />
<img width="1536" height="788" alt="image" src="https://github.com/user-attachments/assets/54c65f03-7161-48cc-b9fd-5eea79c18c0b" />

---

## 🛣️ Roadmap

- [ ] Inline review comments
- [ ] Multi-model AI support
- [ ] Team workspaces
- [ ] Review quality scoring
- [ ] Slack integration
- [ ] GitLab support
- [ ] Bitbucket support

---

## 🤝 Contributing

Contributions are welcome.

```bash
fork → branch → commit → pull request
```

Please open an issue before submitting major changes.

---

## ⭐ Support

If you find this project useful:

- Star the repository
- Report bugs
- Suggest features
- Share feedback

Built with ❤️ using Next.js, Prisma, GitHub APIs, and AI.
