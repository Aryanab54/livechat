# LiveChat - Real-time Messaging Application

A real-time chat application built with Next.js, TypeScript, Convex, and Clerk.

## Features

- 🔐 Authentication with Clerk (email/social login)
- 💬 Real-time messaging
- 👥 User discovery
- 🎨 Modern UI with shadcn/ui and Tailwind CSS

## Setup Instructions

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

This will:
- Start the Convex development server
- Create your database schema
- Generate API types

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ChatWindow.tsx    # Chat interface
│   └── UserList.tsx      # User list sidebar
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User functions
│   └── messages.ts       # Message functions
├── hooks/                # Custom React hooks
└── providers/            # Context providers
```

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Database**: Convex
- **Authentication**: Clerk
- **UI**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
