import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const StatusType = v.union(
    v.literal(0), // new
    v.literal(1), // in_progress
    v.literal(2), // complete
    v.literal(3), // archived
    v.literal(-1) // error
);

export default defineSchema({
    messages: defineTable({
        userId: v.string(),
        text: v.string(),
        status: StatusType,
    }).index("by_user", ["userId"]),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"]),
});
