"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";

interface ConversationListProps {
  currentUserId: Id<"users">;
  selectedUserId?: Id<"users">;
  onSelectUser: (userId: Id<"users">) => void;
}

export function ConversationList({ currentUserId, selectedUserId, onSelectUser }: ConversationListProps) {
  const conversations = useQuery(api.messages.getConversations, { userId: currentUserId });

  return (
    <ScrollArea className="h-[calc(100vh-73px)]">
      {conversations?.map(({ user, lastMessage }) => (
        <button
          key={user._id}
          onClick={() => onSelectUser(user._id)}
          className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors border-b ${
            selectedUserId === user._id ? "bg-accent" : ""
          }`}
        >
          <Avatar>
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left overflow-hidden">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage.senderId === currentUserId ? "You: " : ""}
              {lastMessage.content}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(lastMessage.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </button>
      ))}
      {conversations?.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No conversations yet
        </div>
      )}
    </ScrollArea>
  );
}
