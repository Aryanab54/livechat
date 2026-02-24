# LiveChat - Real-time Messaging Application

A fully-featured real-time chat application built with Next.js, TypeScript, Convex, and Clerk. Connect with users instantly and chat in real-time with a modern, responsive interface.

## ✨ Features

### Authentication & User Management
- 🔐 **Secure Authentication** - Sign up/login via email or social providers (Google, GitHub) using Clerk
- 👤 **User Profiles** - Display user avatars and names throughout the app
- 🔍 **User Discovery** - Browse all registered users with real-time search filtering

### Messaging
- 💬 **One-on-One Direct Messages** - Private conversations between users
- ⚡ **Real-time Updates** - Messages appear instantly using Convex subscriptions
- 🕐 **Smart Timestamps** - Context-aware time display (today: "2:34 PM", older: "Feb 15, 2:34 PM")
- 🗑️ **Message Deletion** - Delete your own messages (soft delete with "This message was deleted" placeholder)
- 😊 **Message Reactions** - React with emojis (👍 ❤ 😂 😮 😢) - one reaction per user, click again to remove

### User Experience
- 🟢 **Online/Offline Status** - Real-time presence indicators showing who's currently active
- ⌨️ **Typing Indicators** - See when someone is typing with animated dots
- 🔔 **Unread Message Badges** - Count of unread messages per conversation, auto-clears when opened
- 📜 **Smart Auto-Scroll** - Auto-scroll to new messages, or show "↓ New Messages" button if scrolled up
- 💀 **Empty States** - Helpful messages when there are no conversations, messages, or search results
- ⏳ **Loading States** - Skeleton loaders and spinners for smooth UX
- ❌ **Error Handling** - Graceful error messages with retry options for failed actions

### Design
- 📱 **Fully Responsive** - Optimized layouts for mobile, tablet, and desktop
  - **Desktop (≥1024px)**: Sidebar and chat displayed side-by-side
  - **Mobile/Tablet (<1024px)**: Conversation list by default, full-screen chat with back button
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌓 **Dark Mode Support** - Automatic theme switching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Clerk account ([sign up here](https://clerk.com))
- A Convex account ([sign up here](https://convex.dev))

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable your preferred authentication methods (Email, Google, GitHub, etc.)
4. Copy your API keys from the dashboard
5. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Setup Convex Database

```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Set up the database schema
- Start the Convex development server
- Generate a `CONVEX_DEPLOYMENT` in your `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Convex (real-time backend)
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📁 Project Structure

```
livechat/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main chat page
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles and Tailwind config
├── components/            # React components
│   ├── ChatWindow.tsx     # Main chat interface
│   ├── ConversationList.tsx # Sidebar conversation list
│   ├── UserList.tsx       # User discovery and search
│   ├── MessageItem.tsx    # Individual message with reactions
│   ├── Skeletons.tsx      # Loading state components
│   └── ui/                # shadcn/ui components
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── users.ts           # User queries and mutations
│   ├── messages.ts        # Message operations
│   ├── presence.ts        # Online/offline status
│   ├── typing.ts          # Typing indicators
│   ├── reactions.ts       # Message reactions
│   └── auth.config.js     # Clerk integration
├── hooks/                 # Custom React hooks
│   ├── useStoreUser.ts    # Sync Clerk user to Convex
│   └── usePresence.ts     # Update user presence
├── lib/                   # Utility functions
│   └── utils.ts           # Helper functions (timestamps, etc.)
└── providers/             # React context providers
    └── ConvexClientProvider.tsx
```

## 🎯 Key Features Implementation

### Real-time Messaging
Messages are stored in Convex and delivered instantly to all participants using Convex's reactive queries. No polling or manual refreshing needed.

### Presence System
Users' online status is tracked by updating a timestamp every 15 seconds. Users are considered online if their last update was within 30 seconds.

### Typing Indicators
When a user types, a typing event is sent to Convex. The indicator automatically clears after 2 seconds of inactivity or when the message is sent.

### Unread Counts
Messages have a `read` boolean field. Counts are calculated in real-time by querying unread messages per conversation. Opening a conversation marks all messages as read.

### Message Reactions
Each user can add one reaction per message. Clicking a different emoji replaces the current reaction. Clicking the same emoji removes it. Reaction counts are aggregated and displayed below messages.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CONVEX_DEPLOYMENT` (auto-generated by Convex)
4. Deploy!

### Deploy Convex

```bash
npx convex deploy
```

This creates a production Convex deployment and updates your environment variables.

## 📝 License

MIT License - feel free to use this project for learning or as a starting point for your own chat application.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using modern web technologies
