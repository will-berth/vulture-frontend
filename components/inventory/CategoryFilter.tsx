"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PlusCircle } from "@mynaui/icons-react"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"

interface Category {
    id: number;
    name: string;
}

interface CategoryFilterProps{
    selectorName: string;
    selectors: Category[];
    selectorHandler: (id: number) => void;
    selectorsActive: number[];
}

export function CategoryFilter({selectorName, selectors, selectorHandler, selectorsActive}: CategoryFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-start border border-dashed shadow-sm"
        >
            <PlusCircle className="h-4 w-4 mr-2"/>{selectorName}
            {(selectorsActive.length > 0) && <>
                <Separator orientation="vertical" className="ml-2"/>
                {
                    (selectorsActive.length > 2)
                    ? (
                        <Badge variant="secondary" className="ml-2">
                            {selectorsActive.length} Categorías
                        </Badge>
                    )
                    : (
                        selectors.map((selector) => {
                            if (selectorsActive.includes(selector.id)) {
                            return (
                                <Badge key={selector.id} variant="secondary" className="ml-2">
                                {selector.name}
                                </Badge>
                            );
                            }
                            return null;
                        })
                    )
                }
                
            </>}
        </Button>
      </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                {selectors.map((selector) => (
                    <CommandItem
                    key={selector.id}
                    value={selector.id.toString()}
                    onSelect={() => selectorHandler(selector.id)}
                    >
                        <Checkbox id={selector.id.toString()} className="mr-2" checked={selectorsActive.includes(selector.id)}/>
                        {selector.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
}
