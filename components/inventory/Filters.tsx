import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ListFilter } from "lucide-react"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Filters {
  created_at: Date | undefined;
  name: string;
  price_min: string;
  price_max: string;
  stock_min: string;
  stock_max: string;
}
interface FilterDropDownProps{
  onFilterChange: (filter: Filters) => void
}

export default function FilterDropdown({ onFilterChange }: FilterDropDownProps) {
  const [name, setName] = useState("")
  const [priceMin, setpriceMin] = useState("")
  const [priceMax, setpriceMax] = useState("")
  const [stockMin, setstockMin] = useState("")
  const [stockMax, setstockMax] = useState("")
  const [date, setDate] = useState<Date>()

  const handleApplyFilters = () => {
    onFilterChange({
      created_at: date,
      name: name,
      price_min: priceMin,
      price_max: priceMax,
      stock_min: stockMin,
      stock_max: stockMax,
    })
  }

  return (
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <ListFilter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Filtros</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Buscar por nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="priceMin">Precio mínimo</Label>
                  <Input
                    id="priceMin"
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setpriceMin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMax">Precio máximo</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setpriceMax(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="stockMin">Stock mínimo</Label>
                  <Input
                    id="stockMin"
                    type="number"
                    placeholder="Min"
                    value={stockMin}
                    onChange={(e) => setstockMin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockMax">Stock máximo</Label>
                  <Input
                    id="stockMax"
                    type="number"
                    placeholder="Max"
                    value={stockMax}
                    onChange={(e) => setstockMax(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fecha registrada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy-MM-dd") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="w-full" onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}