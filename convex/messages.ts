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
      read: false,
      deleted: false,
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
    const unreadCounts = new Map();

    userMessages.forEach((msg) => {
      const otherUserId = msg.senderId === args.userId ? msg.receiverId : msg.senderId;
      const existing = conversationMap.get(otherUserId);
      if (!existing || msg.timestamp > existing.timestamp) {
        conversationMap.set(otherUserId, msg);
      }
      
      if (msg.receiverId === args.userId && !msg.read) {
        unreadCounts.set(otherUserId, (unreadCounts.get(otherUserId) || 0) + 1);
      }
    });

    const conversations = await Promise.all(
      Array.from(conversationMap.entries()).map(async ([userId, lastMsg]) => {
        const user = await ctx.db.get(userId);
        return { 
          user, 
          lastMessage: lastMsg,
          unreadCount: unreadCounts.get(userId) || 0,
        };
      })
    );

    return conversations
      .filter((c) => c.user)
      .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  },
});

export const markAsRead = mutation({
  args: {
    userId: v.id("users"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").collect();
    const unreadMessages = messages.filter(
      (msg) =>
        msg.senderId === args.otherUserId &&
        msg.receiverId === args.userId &&
        !msg.read
    );

    await Promise.all(
      unreadMessages.map((msg) => ctx.db.patch(msg._id, { read: true }))
    );
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    
    if (!message || message.senderId !== args.userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.messageId, { deleted: true });
  },
});
