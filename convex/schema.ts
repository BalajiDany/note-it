import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
        userId: v.string(),
        text: v.string(),
    }).index("by_user", ["userId"]),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"]),
});
