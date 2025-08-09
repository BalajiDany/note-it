import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMessage = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, { text }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }

        await ctx.db.insert("messages", { text, userId: identity.tokenIdentifier });
    },
});

export const all = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }

        return await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("userId"), identity.tokenIdentifier))
            .collect();
    },
});

export const deleteMessage = mutation({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const message = await ctx.db.get(id);

        if (message?.userId !== identity.tokenIdentifier) {
            throw new Error("Not authorized");
        } else if (!message) {
            throw new Error("Message not found");
        }

        await ctx.db.delete(id);
    },
});
