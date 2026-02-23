import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const setTyping = mutation({
  args: {
    userId: v.id("users"),
    chatWithUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        chatWithUserId: args.chatWithUserId,
        timestamp: Date.now(),
      });
    } else {
      await ctx.db.insert("typing", {
        userId: args.userId,
        chatWithUserId: args.chatWithUserId,
        timestamp: Date.now(),
      });
    }
  },
});

export const clearTyping = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getTypingUsers = query({
  args: { chatWithUserId: v.id("users") },
  handler: async (ctx, args) => {
    const typing = await ctx.db
      .query("typing")
      .withIndex("by_chat", (q) => q.eq("chatWithUserId", args.chatWithUserId))
      .collect();

    const now = Date.now();
    const TYPING_THRESHOLD = 3000; // 3 seconds

    return typing
      .filter((t) => now - t.timestamp < TYPING_THRESHOLD)
      .map((t) => t.userId);
  },
});
