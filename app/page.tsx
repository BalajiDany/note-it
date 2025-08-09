'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Id } from '@/convex/_generated/dataModel'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Menu, SendHorizontal, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { api } from '../convex/_generated/api'

dayjs.extend(relativeTime);

export default function Home() {
    return (
        <>
            <Authenticated>
                <Content />
            </Authenticated>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
        </>
    )
}

function Content() {

    const [message, setMessage] = useState('')
    const [lockDelete, setLockDelete] = useState(false)

    const [startDate] = useState(dayjs().startOf('day').valueOf())
    const [endDate] = useState(dayjs().endOf('day').valueOf())

    const addMessage = useMutation(api.messages.addMessage);
    const deleteMessage = useMutation(api.messages.deleteMessage);

    const allMessages = useQuery(api.messages.getByDate, {
        start: startDate,
        end: endDate
    });

    const submitClick = useCallback(async () => {
        // await api.postMessage('hello')
        if (!message) return

        await addMessage({ text: message })
        setMessage('')
    }, [message, addMessage, setMessage]);

    const deleteClick = useCallback(async (id: Id<"messages">) => {
        if (lockDelete) return

        setLockDelete(true)
        await deleteMessage({ id })
        setLockDelete(false)

    }, [lockDelete, setLockDelete, deleteMessage])

    return (
        <div className='mx-auto container flex flex-col max-w-3xl px-4 pt-4 pb-8 lg:pb-4 h-dvh gap-4'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-2'>
                    <p className='text-sm leading-none font-medium'>
                        Today
                    </p>
                </div>
                <UserButton />
            </div>
            <div className='grow overflow-auto no-scrollbar'>
                <div className='flex flex-col gap-3'>
                    {allMessages && allMessages.map((message, index) => (
                        <div key={index} className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-card shadow-xs text-card-foreground'>
                            <div className='space-y-1 font-normal min-w-0'>
                                <h4 className="text-sm shrink-0 font-medium truncate">
                                    {message.text}
                                </h4>
                                <div className='flex items-center h-full justify-start gap-2'>

                                    <p className="text-muted-foreground text-sm">
                                        {dayjs(message._creationTime).fromNow()}
                                    </p>

                                    <Separator orientation='vertical' className='h-3!' />

                                    <p className='text-sm text-muted-foreground'>
                                        AI responses
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Button variant="secondary" size="icon" className="size-8 cursor-pointer" onClick={() => deleteClick(message._id)}>
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <form action={submitClick} className='flex gap-4'>
                <Button variant="secondary" size="icon" className="cursor-pointer">
                    <Menu />
                </Button>
                <Input type="text" list="autocompleteOff" value={message} onChange={e => setMessage(e.target.value)} autoComplete='off' placeholder="Enter a message" />
                <Button type="submit" size="icon" >
                    <SendHorizontal />
                </Button>
            </form>
        </div>
    )
}
