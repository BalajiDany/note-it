import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getUser } from "./user";

export const addMessage = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, { text }) => {
        const user = await getUser(ctx);
        await ctx.db.insert("messages", { text, userId: user._id, status: 0 });
    },
});

export const getByDate = query({
    args: {
        start: v.number(),
        end: v.number(),
    },
    handler: async (ctx, { start, end }) => {
        const user = await getUser(ctx);
        const messages = await ctx.db
            .query("messages")
            .filter((q) =>
                q.and(
                    q.eq(q.field("userId"), user._id),
                    q.gte(q.field("_creationTime"), start),
                    q.lte(q.field("_creationTime"), end)
                )
            )
            .collect();
        return messages;
    },
});

export const deleteMessage = mutation({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, { id }) => {
        const user = await getUser(ctx);
        const message = await ctx.db.get(id);

        if (message?.userId !== user._id) {
            throw new Error("Not authorized");
        } else if (!message) {
            throw new Error("Message not found");
        }

        await ctx.db.delete(id);
    },
});
