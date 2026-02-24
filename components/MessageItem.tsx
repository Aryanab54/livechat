"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Trash2, Smile } from "lucide-react";
import { formatMessageTime } from "@/lib/utils";

const REACTIONS = ["👍", "❤", "😂", "😮", "😢"];

interface MessageItemProps {
  msg: any;
  currentUserId: Id<"users">;
  onDelete: (id: Id<"messages">) => void;
}

export function MessageItem({ msg, currentUserId, onDelete }: MessageItemProps) {
  const [showReactions, setShowReactions] = useState(false);
  const reactions = useQuery(api.reactions.getReactions, { messageId: msg._id });
  const toggleReaction = useMutation(api.reactions.toggleReaction);

  const handleReaction = async (emoji: string) => {
    await toggleReaction({ messageId: msg._id, userId: currentUserId, emoji });
    setShowReactions(false);
  };

  return (
    <div className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col gap-1 max-w-[70%]">
        <div className="flex items-end gap-2 group">
          {msg.senderId === currentUserId && !msg.deleted && (
            <button
              onClick={() => onDelete(msg._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity mb-2"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </button>
          )}
          <div className="relative flex-1">
            <div
              className={`rounded-lg px-4 py-2 break-words ${
                msg.senderId === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.deleted === true ? (
                <p className="italic opacity-70">This message was deleted</p>
              ) : (
                <p className="break-words">{msg.content}</p>
              )}
              <p className="text-xs opacity-70 mt-1">
                {formatMessageTime(msg.timestamp)}
              </p>
            </div>
            {!msg.deleted && (
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded-full p-1"
              >
                <Smile className="h-3 w-3" />
              </button>
            )}
            {showReactions && (
              <div className={`absolute top-full mt-1 bg-background border rounded-lg p-2 flex gap-1 shadow-lg z-10 ${
                msg.senderId === currentUserId ? "right-0" : "left-0"
              }`}>
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="hover:scale-125 transition-transform text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 ml-2">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction.emoji)}
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  reaction.userIds.includes(currentUserId)
                    ? "bg-primary/20 border-primary"
                    : "bg-background"
                }`}
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
