"use client";

import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UserList } from "@/components/UserList";
import { ConversationList } from "@/components/ConversationList";
import { ChatWindow } from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStoreUser } from "@/hooks/useStoreUser";
import { MessageSquare, Users } from "lucide-react";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | undefined>();
  const [activeTab, setActiveTab] = useState<"conversations" | "users">("conversations");
  
  useStoreUser();
  
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    isSignedIn && user ? { clerkId: user.id } : "skip"
  );
  
  const users = useQuery(api.users.getAllUsers);
  const selectedUser = users?.find((u) => u._id === selectedUserId);

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">LiveChat</h1>
          <p className="text-muted-foreground">Sign in to start chatting</p>
          <SignInButton mode="modal">
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">LiveChat</h1>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user?.fullName}</span>
          <SignOutButton>
            <Button variant="outline" size="sm">Sign Out</Button>
          </SignOutButton>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {currentUser && (
          <div className="w-80 border-r bg-muted/10">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("conversations")}
                className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "conversations" ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Chats
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "users" ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <Users className="h-4 w-4" />
                Users
              </button>
            </div>
            {activeTab === "conversations" ? (
              <ConversationList
                currentUserId={currentUser._id}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            ) : (
              <UserList
                currentUserId={currentUser._id}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            )}
          </div>
        )}
        
        {selectedUser && currentUser ? (
          <ChatWindow currentUserId={currentUser._id} selectedUser={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
