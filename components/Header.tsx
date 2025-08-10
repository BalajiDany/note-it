'use client'

import { UserButton } from '@clerk/nextjs'
import dayjs from 'dayjs'
import { useState } from 'react'
import { DateNavigation } from './DateNavigation'

interface HeaderProps {
    date: Date
    onDateChange: (date: Date) => void
}

export function Header({ date, onDateChange }: HeaderProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return

        onDateChange(selectedDate)
        setIsCalendarOpen(false)
    }

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev'
            ? dayjs(date).subtract(1, 'day').toDate()
            : dayjs(date).add(1, 'day').toDate()
        onDateChange(newDate)
    }

    return (
        <div className="grid grid-cols-3 items-center justify-items-center">
            <div className="justify-self-start">
                <h1 className="text-sm font-bold">Note It</h1>
            </div>

            <DateNavigation
                date={date}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={setIsCalendarOpen}
                onDateSelect={handleDateSelect}
                onNavigateDate={navigateDate}
            />

            <div className="justify-self-end">
                <UserButton />
            </div>
        </div>
    )
}