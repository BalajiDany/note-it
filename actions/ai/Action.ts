"use server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export async function aiAction(messageId: Id<"messages">) {
    const token = await getAuthToken();

    const message = await fetchQuery(api.domains.messages.getById, { id: messageId }, { token });
    await fetchMutation(api.domains.messages.updateStatus, { id: message._id, status: 1 }, { token });

    try {
        const { text } = await generateText({
            model: openai("gpt-5-nano-2025-08-07"),
            messages: [
                {
                    role: "system",
                    content: "Helpful assistant, responsd i,n 10 words max",
                },
                {
                    role: "user",
                    content: message.text,
                },
            ],
        });

        await fetchMutation(
            api.domains.messages.updateResponse,
            {
                id: message._id,
                status: 2,
                response: text,
            },
            { token }
        );
    } catch (error) {
        console.error("Failed to generate text:", error);
        await fetchMutation(api.domains.messages.updateStatus, { id: message._id, status: -1 }, { token });
    }

    return {
        status: "ok",
    };
}
