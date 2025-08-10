import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { Doc } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const getUser = async (ctx: GenericQueryCtx<any> | GenericMutationCtx<any>): Promise<Doc<"users">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Not authenticated");
    }

    return await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
};

// Add this query to check if user exists
export const getUserById = query({
  args: { },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const storeUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        const user = await getUser(ctx);
        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value.
            if (user.name !== identity.name) {
                await ctx.db.patch(user._id, { name: identity.name });
            }
            return user._id;
        }

        return await ctx.db.insert("users", {
            name: identity.name ?? "Anonymous",
            email: identity.email ?? "Unknown",
            tokenIdentifier: identity.tokenIdentifier,
        });
    },
});
