**LiveChat**

LiveChat is a real-time messaging application that I built using Next.js, TypeScript, Convex, and Clerk. The main goal of this project was to create a smooth one-to-one chat experience with instant updates and a clean, responsive UI.

I wanted to build something that feels fast and modern without relying on manual refresh or complicated backend setups.

About the Project

In this application, users can sign up and log in securely using Clerk authentication. I integrated social login providers like Google and GitHub, and each user has a profile with their name and avatar displayed across the app.

Users can search for other registered users in real time and start private conversations with them.

Messaging System

I implemented real-time one-to-one messaging using Convex. Messages appear instantly for both users without refreshing the page.

Each message shows a smart timestamp depending on when it was sent. Users can delete their own messages, and instead of removing them completely, the app displays a placeholder saying the message was deleted.

I also added emoji reactions. Each user can react once per message, change their reaction, or remove it by clicking again.

User Experience Features

To make the experience more interactive, I built a real-time online/offline presence system based on recent activity timestamps.

Typing indicators appear when someone is typing and automatically disappear after a short period of inactivity or when the message is sent.

Unread message counts are calculated dynamically and are cleared when the conversation is opened.

The chat automatically scrolls to the newest message. If the user scrolls up, a button appears to quickly jump back to the latest messages.

I also handled loading states and error scenarios properly to keep the UI smooth and reliable.

Responsive Design

I designed the layout to work well on all screen sizes.

On desktop, the conversation list and chat window appear side by side.
On mobile and tablet, the conversation list is shown first, and the chat opens in full screen with a back button.

The UI is built using Tailwind CSS and shadcn/ui components, and it supports dark mode.

Tech Stack

Next.js (App Router)
TypeScript
Convex (real-time backend and database)
Clerk (authentication)
Tailwind CSS
shadcn/ui
Lucide React

Getting Started

To run this project locally:

Install dependencies

npm install

Set up Clerk by creating a new application in the Clerk dashboard and adding your keys to a .env.local file:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here

Then initialize Convex:

npx convex dev

Finally, start the development server:

npm run dev

Open [http://localhost:3000] in your browser.

Project Structure

The app directory contains the main Next.js application files.
The components directory contains reusable UI components like the chat window and message items.
The convex directory contains backend logic including schema, queries, mutations, presence tracking, typing indicators, and reactions.
I used custom hooks for syncing users and managing presence. Utility functions are placed inside the lib folder.

Deployment

The frontend can be deployed on Vercel after adding the required environment variables.

To deploy Convex to production:

npx convex deploy


I built this project to explore real-time systems and improve my understanding of full-stack architecture using modern tools.
