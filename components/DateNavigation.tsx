'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateNavigationProps {
    date: Date
    isCalendarOpen: boolean
    onCalendarOpenChange: (open: boolean) => void
    onDateSelect: (date: Date | undefined) => void
    onNavigateDate: (direction: 'prev' | 'next') => void
}

export function DateNavigation({
    date,
    isCalendarOpen,
    onCalendarOpenChange,
    onDateSelect,
    onNavigateDate
}: DateNavigationProps) {
    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigateDate('prev')}
                aria-label="Previous day"
            >
                <ChevronLeft />
            </Button>

            <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-fit justify-between font-normal">
                        {dayjs(date).format('DD MMM, YYYY')}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={onDateSelect}
                    />
                </PopoverContent>
            </Popover>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigateDate('next')}
                aria-label="Next day"
            >
                <ChevronRight />
            </Button>
        </div>
    )
}