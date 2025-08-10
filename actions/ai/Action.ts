"use server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export async function aiAction(messageId: Id<"messages">) {
    const token = await getAuthToken();

    const message = await fetchQuery(api.domains.messages.getById, { id: messageId }, { token });
    await fetchMutation(api.domains.messages.updateStatus, { id: message._id, status: 1 }, { token });
    setTimeout(async () => {
        await fetchMutation(api.domains.messages.updateStatus, { id: message._id, status: 2 }, { token });
    }, 5000);

    return {
        status: "ok",
    };
}
