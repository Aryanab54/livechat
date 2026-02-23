import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updatePresence = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
    } else {
      await ctx.db.insert("presence", {
        userId: args.userId,
        lastSeen: Date.now(),
      });
    }
  },
});

export const getOnlineUsers = query({
  handler: async (ctx) => {
    const presence = await ctx.db.query("presence").collect();
    const now = Date.now();
    const ONLINE_THRESHOLD = 30000; // 30 seconds

    return presence
      .filter((p) => now - p.lastSeen < ONLINE_THRESHOLD)
      .map((p) => p.userId);
  },
});
