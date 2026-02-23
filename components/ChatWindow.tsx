"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Send, MessagesSquare, ArrowDown, Trash2 } from "lucide-react";
import { formatMessageTime } from "@/lib/utils";

interface ChatWindowProps {
  currentUserId: Id<"users">;
  selectedUser: { _id: Id<"users">; name: string; imageUrl?: string };
  isOnline: boolean;
}

export function ChatWindow({ currentUserId, selectedUser, isOnline }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isUserScrollingRef = useRef(false);
  
  const messages = useQuery(api.messages.getConversation, {
    userId1: currentUserId,
    userId2: selectedUser._id,
  });
  
  const typingUsers = useQuery(api.typing.getTypingUsers, {
    chatWithUserId: currentUserId,
  });
  
  const isOtherUserTyping = typingUsers?.includes(selectedUser._id);
  
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const clearTyping = useMutation(api.typing.clearTyping);
  const markAsRead = useMutation(api.messages.markAsRead);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowScrollButton(false);
      isUserScrollingRef.current = false;
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    if (isAtBottom) {
      setShowScrollButton(false);
      isUserScrollingRef.current = false;
    } else {
      isUserScrollingRef.current = true;
    }
  };

  useEffect(() => {
    markAsRead({ userId: currentUserId, otherUserId: selectedUser._id });
  }, [selectedUser._id, currentUserId, markAsRead]);

  useEffect(() => {
    if (!isUserScrollingRef.current) {
      scrollToBottom();
    } else {
      setShowScrollButton(true);
    }
  }, [messages, isOtherUserTyping]);

  const handleTyping = () => {
    setTyping({ userId: currentUserId, chatWithUserId: selectedUser._id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      clearTyping({ userId: currentUserId });
    }, 2000);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    clearTyping({ userId: currentUserId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    await sendMessage({
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: message,
    });
    
    setMessage("");
    isUserScrollingRef.current = false;
    scrollToBottom();
  };

  const handleDelete = async (messageId: Id<"messages">) => {
    await deleteMessage({ messageId, userId: currentUserId });
  };

  return (
    <div className="flex-1 flex flex-col relative">
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
            {isOtherUserTyping ? "typing..." : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4" onScroll={handleScroll}>
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
                <div className="flex items-end gap-2 group">
                  {msg.senderId === currentUserId && !msg.deleted && (
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mb-2"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.senderId === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.deleted ? (
                      <p className="italic opacity-70">This message was deleted</p>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {formatMessageTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isOtherUserTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}

      <div className="p-4 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
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
