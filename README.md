# LiveChat - Real-time Messaging Application

A real-time chat application built with Next.js, TypeScript, Convex, and Clerk.

## Features

- 🔐 Authentication with Clerk (email/social login)
- 💬 Real-time messaging
- 👥 User discovery
- 🎨 Modern UI with shadcn/ui and Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your API keys
4. Update `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### 3. Setup Convex

```bash
npx convex dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 16 + TypeScript
- Convex (Database)
- Clerk (Authentication)
- shadcn/ui + Tailwind CSS
