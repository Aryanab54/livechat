import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    timestamp: v.number(),
    read: v.boolean(),
    deleted: v.optional(v.boolean()),
  })
    .index("by_receiver", ["receiverId"])
    .index("by_sender", ["senderId"]),

  presence: defineTable({
    userId: v.id("users"),
    lastSeen: v.number(),
  }).index("by_user", ["userId"]),

  typing: defineTable({
    userId: v.id("users"),
    chatWithUserId: v.id("users"),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_chat", ["chatWithUserId"]),

  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  })
    .index("by_message", ["messageId"])
    .index("by_user_message", ["userId", "messageId"]),
});
