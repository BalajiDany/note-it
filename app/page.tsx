'use client'

import { useStoreUserEffect } from '@/components/hooks/useAuthState'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Id } from '@/convex/_generated/dataModel'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { ChevronLeft, ChevronRight, Menu, SendHorizontal, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { api } from '../convex/_generated/api'

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(updateLocale);

// dayjs.updateLocale('en', {
// //   calendar: {
// //     lastDay: '[Yesterday at] LT',
// //     sameDay: '[Today at] LT',
// //     nextDay: '[Tomorrow at] LT',
// //     lastWeek: '[last] dddd [at] LT',
// //     nextWeek: 'dddd [at] LT',
// //     sameElse: 'L'
// //   }
// // })

export default function Home() {
    const { isLoading, isAuthenticated } = useStoreUserEffect();
    return (
        <main>
            {isLoading ? (<>Loading...</>) : !isAuthenticated ? (<SignInButton />) : (<Content />)}
        </main>
    );
}

const format = {
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    lastDay: "[Yesterday]",
    nextWeek: "dddd",
    lastWeek: "[Last] dddd",
    sameElse: " ",
}

function Content() {

    const [message, setMessage] = useState('')
    const [lockDelete, setLockDelete] = useState(false)

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date>(new Date())

    // const [startDate, setStartDate] = useState(dayjs().startOf('day').valueOf())
    // const [endDate, setEndDate] = useState(dayjs().endOf('day').valueOf())

    const addMessage = useMutation(api.messages.addMessage);
    const deleteMessage = useMutation(api.messages.deleteMessage);

    const allMessages = useQuery(api.messages.getByDate, {
        start: dayjs(date).startOf('day').valueOf(),
        end: dayjs(date).endOf('day').valueOf()
    });

    // useEffect(() => {
    //     setStartDate(dayjs(date).startOf('day').valueOf())
    //     setEndDate(dayjs(date).endOf('day').valueOf())
    // }, [date, setStartDate, setEndDate])

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
            <div className='grid grid-cols-3 items-center justify-items-center'>
                <div className='justify-self-start'>
                    <h1 className='text-sm font-bold'>{allMessages?.length}</h1>
                </div>
                <div className='flex gap-2'>
                    <Button variant="ghost" size="icon" onClick={() => setDate(d => dayjs(d).subtract(1, 'day').toDate())}>
                        <ChevronLeft />
                    </Button>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="w-fit justify-between font-normal" >
                                {date ? dayjs(date).format('DD MMM, YYYY') : "Select date"}
                                {" "}
                                {/* {date ? dayjs(date).calendar(null, format) : ""} */}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    if (!date) return;

                                    setDate(date)
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" onClick={() => setDate(d => dayjs(d).add(1, 'day').toDate())}>
                        <ChevronRight />
                    </Button>
                </div>
                <div className='justify-self-end'>
                    <UserButton />
                </div>
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
