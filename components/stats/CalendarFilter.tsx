"use client"

import * as React from "react"
import { addDays, format, isBefore, isEqual, startOfToday } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface RangeCalendarProps {
    className?: React.HTMLAttributes<HTMLDivElement>;
    applyFilter: (data: any) => void;
}

export function RangeCalendar({ className, applyFilter }: RangeCalendarProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: startOfToday(),
        to: addDays(startOfToday(), 7),
    })


    const handleSelect = (selectedDay: Date | undefined) => {
        setDate((prevDate) => {
        if (!selectedDay) return prevDate;

        if (!prevDate?.from) {
            return { from: selectedDay, to: undefined };
        } else if (prevDate.from && !prevDate.to) {
            if (isBefore(selectedDay, prevDate.from)) {
            return { from: selectedDay, to: prevDate.from };
            } else {
            return { from: prevDate.from, to: selectedDay };
            }
        }

        return { from: selectedDay, to: undefined };
        });
    };

    React.useEffect(() => {
        if(date?.from && date.to){
            // applyFilter({from: format(date.from, 'yyyy-MM-dd'), to: format(date.to
            applyFilter({
                start_date: date.from,
                end_date: date.to
            });
        }
    }, [date]);

    return (
        <div className={cn("grid gap-2", className)}>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                date.to ? (
                    <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                    </>
                ) : (
                    format(date.from, "LLL dd, y")
                )
                ) : (
                <span>Pick a date range</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                initialFocus
                mode="single"
                defaultMonth={date?.from}
                selected={date?.from}
                onSelect={handleSelect}
                numberOfMonths={1}
                modifiers={{
                ...(date?.from && date?.to
                    ? {
                        range: { from: date.from, to: date.to },
                        rangeStart: date.from,
                        rangeEnd: date.to,
                    }
                    : {}),
                }}
                modifiersStyles={{
                range: { backgroundColor: 'var(--primary-100)' },
                rangeStart: { color: 'var(--primary)', backgroundColor: 'var(--primary)', borderRadius: '50%' },
                rangeEnd: { color: 'var(--primary)', backgroundColor: 'var(--primary)', borderRadius: '50%' },
                }}
            />
            </PopoverContent>
        </Popover>
        </div>
    )
}