"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";
import { MessageSquare } from "lucide-react";

interface ConversationListProps {
  currentUserId: Id<"users">;
  selectedUserId?: Id<"users">;
  onSelectUser: (userId: Id<"users">) => void;
}

export function ConversationList({ currentUserId, selectedUserId, onSelectUser }: ConversationListProps) {
  const conversations = useQuery(api.messages.getConversations, { userId: currentUserId });

  return (
    <ScrollArea className="h-[calc(100vh-73px)]">
      {conversations?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-lg mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation by selecting a user from the Users tab
          </p>
        </div>
      ) : (
        conversations?.map(({ user, lastMessage }) => (
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
        ))
      )}
    </ScrollArea>
  );
}
