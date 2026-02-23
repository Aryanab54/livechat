import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getConversation = query({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").collect();
    
    return messages
      .filter(
        (msg) =>
          (msg.senderId === args.userId1 && msg.receiverId === args.userId2) ||
          (msg.senderId === args.userId2 && msg.receiverId === args.userId1)
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  },
});

export const getConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").collect();
    const userMessages = messages.filter(
      (msg) => msg.senderId === args.userId || msg.receiverId === args.userId
    );

    const conversationMap = new Map();
    userMessages.forEach((msg) => {
      const otherUserId = msg.senderId === args.userId ? msg.receiverId : msg.senderId;
      const existing = conversationMap.get(otherUserId);
      if (!existing || msg.timestamp > existing.timestamp) {
        conversationMap.set(otherUserId, msg);
      }
    });

    const conversations = await Promise.all(
      Array.from(conversationMap.entries()).map(async ([userId, lastMsg]) => {
        const user = await ctx.db.get(userId);
        return { user, lastMessage: lastMsg };
      })
    );

    return conversations
      .filter((c) => c.user)
      .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  },
});
