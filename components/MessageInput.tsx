'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, SendHorizontal } from 'lucide-react'
import { FormEvent } from 'react'

interface MessageInputProps {
    message: string
    onMessageChange: (message: string) => void
    onSubmit: () => Promise<void>
}

export function MessageInput({ message, onMessageChange, onSubmit }: MessageInputProps) {
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await onSubmit()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-4">
            <Button
                type="button"
                variant="secondary"
                size="icon"
                className="cursor-pointer"
                aria-label="Menu"
            >
                <Menu />
            </Button>

            <Input
                type="text"
                list="autocompleteOff"
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="Enter a message"
                className="flex-1"
            />

            <Button
                type="submit"
                size="icon"
                disabled={!message.trim()}
                aria-label="Send message"
            >
                <SendHorizontal />
            </Button>
        </form>
    )
}