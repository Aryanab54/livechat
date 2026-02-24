"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";
import { MessageSquare } from "lucide-react";
import { ConversationSkeleton } from "./Skeletons";

interface ConversationListProps {
  currentUserId: Id<"users">;
  selectedUserId?: Id<"users">;
  onSelectUser: (userId: Id<"users">) => void;
  onlineUsers: Id<"users">[];
}

export function ConversationList({ currentUserId, selectedUserId, onSelectUser, onlineUsers }: ConversationListProps) {
  const conversations = useQuery(api.messages.getConversations, { userId: currentUserId });

  return (
    <ScrollArea className="h-[calc(100vh-73px)]">
      {!conversations ? (
        <ConversationSkeleton />
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-lg mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation by selecting a user from the Users tab
          </p>
        </div>
      ) : (
        conversations.map(({ user, lastMessage, unreadCount }) => {
          if (!user) return null;
          const typedUser = user as { _id: Id<"users">; name: string; imageUrl?: string };
          return (
            <button
              key={typedUser._id}
              onClick={() => onSelectUser(typedUser._id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors border-b ${
                selectedUserId === typedUser._id ? "bg-accent" : ""
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={typedUser.imageUrl} />
                  <AvatarFallback>{typedUser.name[0]}</AvatarFallback>
                </Avatar>
                {onlineUsers.includes(typedUser._id) && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="font-medium">{typedUser.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage.senderId === currentUserId ? "You: " : ""}
                  {lastMessage.content}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(lastMessage.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>
          );
        })
      )}
    </ScrollArea>
  );
}
