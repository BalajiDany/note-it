'use client'

import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useCallback, useState } from 'react'
import { aiAction } from '../actions/ai/Action'
import { Header } from './Header'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'

dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(updateLocale)

export function MainContent() {
    const [message, setMessage] = useState('')
    const [date, setDate] = useState<Date>(new Date())

    const addMessage = useMutation(api.domains.messages.addMessage)

    const allMessages = useQuery(api.domains.messages.getByDate, {
        start: dayjs(date).startOf('day').valueOf(),
        end: dayjs(date).endOf('day').valueOf()
    })

    const handleSubmit = useCallback(async () => {
        if (!message || !message.trim()) return

        const messageId = await addMessage({ text: message })
        setMessage('')

        if (messageId) aiAction(messageId); // Fire and forget

    }, [message, addMessage])

    const handleDateChange = useCallback((newDate: Date) => {
        setDate(newDate)
    }, [])

    return (
        <div className="mx-auto container flex flex-col max-w-3xl px-4 pt-4 pb-8 lg:pb-4 max-h-dvh h-full gap-4">
            <Header
                date={date}
                onDateChange={handleDateChange}
            />

            <MessageList messages={allMessages} />

            <MessageInput
                message={message}
                onMessageChange={setMessage}
                onSubmit={handleSubmit}
            />
        </div>
    )
}