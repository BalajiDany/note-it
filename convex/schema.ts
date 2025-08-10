import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
        userId: v.string(),
        text: v.string(),
        status: v.union(v.literal(0), v.literal(1), v.literal(2), v.literal(3), v.literal(-1)),
    }).index("by_user", ["userId"]),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"]),
});
