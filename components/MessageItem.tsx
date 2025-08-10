'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import dayjs from 'dayjs'
import { Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'

interface Message {
    _id: string
    _creationTime: number
    text: string
}

interface MessageItemProps {
    message: Message
}

export function MessageItem({ message }: MessageItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const deleteMessage = useMutation(api.domains.messages.deleteMessage)

    const handleDelete = useCallback(async () => {
        if (isDeleting) return

        setIsDeleting(true)
        try {
            await deleteMessage({ id: message._id as Id<"messages"> })
        } catch (error) {
            console.error('Failed to delete message:', error)
        } finally {
            setIsDeleting(false)
        }
    }, [isDeleting, deleteMessage, message._id])

    return (
        <div className="border rounded-lg p-3 flex justify-between items-center gap-4 bg-card shadow-xs text-card-foreground">
            <div className="space-y-1 font-normal min-w-0">
                <h4 className="text-sm shrink-0 font-medium truncate">
                    {message.text}
                </h4>
                <div className="flex items-center h-full justify-start gap-2">
                    <p className="text-muted-foreground text-sm">
                        {dayjs(message._creationTime).fromNow()}
                    </p>

                    <Separator orientation="vertical" className="h-3!" />

                    <p className="text-sm text-muted-foreground">
                        AI responses
                    </p>
                </div>
            </div>

            <div>
                <Button
                    variant="secondary"
                    size="icon"
                    className="size-8 cursor-pointer"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label={`Delete message: ${message.text}`}
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    )
}