'use client'

import { MessageItem } from './MessageItem'
import { Doc } from '@/convex/_generated/dataModel'

interface MessageListProps {
    messages: Doc<"messages">[] | undefined
}

export function MessageList({ messages }: MessageListProps) {
    if (!messages) {
        return (
            <div className="grow overflow-auto no-scrollbar">
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading messages...</p>
                </div>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="grow overflow-auto no-scrollbar">
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No messages for this date</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grow overflow-auto no-scrollbar">
            <div className="flex flex-col gap-3">
                {messages.map((message) => (
                    <MessageItem
                        key={message._id}
                        message={message}
                    />
                ))}
            </div>
        </div>
    )
}