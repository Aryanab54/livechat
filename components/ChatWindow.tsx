"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Send, MessagesSquare } from "lucide-react";
import { formatMessageTime } from "@/lib/utils";

interface ChatWindowProps {
  currentUserId: Id<"users">;
  selectedUser: { _id: Id<"users">; name: string; imageUrl?: string };
  isOnline: boolean;
}

export function ChatWindow({ currentUserId, selectedUser, isOnline }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const messages = useQuery(api.messages.getConversation, {
    userId1: currentUserId,
    userId2: selectedUser._id,
  });
  
  const sendMessage = useMutation(api.messages.sendMessage);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    await sendMessage({
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: message,
    });
    
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={selectedUser.imageUrl} />
            <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>
        <div>
          <h2 className="font-semibold">{selectedUser.name}</h2>
          <p className="text-xs text-muted-foreground">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessagesSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start the conversation with {selectedUser.name}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.senderId === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatMessageTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
