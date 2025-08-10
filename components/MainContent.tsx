'use client'

import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useCallback, useState } from 'react'
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

        await addMessage({ text: message })
        setMessage('')
    }, [message, addMessage])

    const handleDateChange = useCallback((newDate: Date) => {
        setDate(newDate)
    }, [])

    return (
        <div className="mx-auto container flex flex-col max-w-3xl px-4 pt-4 pb-8 lg:pb-4 h-dvh gap-4">
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