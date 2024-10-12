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
import { searchProducts, searchProductsByName } from "@/services/api"
import useDebounce from "@/hooks/useDebounce"


interface Products {
    id: number;
    name: string;
    price: number;
    stock: number;
}
interface SearchProductsProps {
    onSelect: (product: any) => void;
    products: Products[];
}

export function ProductCombobox({ onSelect, products }: SearchProductsProps) {
  const [openList, setOpenList] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [query, setQuery] = React.useState("")

  return (
    <Popover open={openList} onOpenChange={setOpenList}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openList}
          className="w-[200px] justify-between"
        >
          {value
            ? products.find((p) => p.id.toString() === value)?.name
            : "Buscar producto..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput onValueChange={(val) => {
            setQuery(val);
          }} placeholder="Buscar producto..." className="h-9" />
            <SearchResults query={query} onSelect={onSelect} setOpenList={setOpenList}/>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface SearchResultsProps {
    query: string;
    onSelect: (product: any) => void;
    setOpenList: (open: boolean) => void;
}

function SearchResults({ query, onSelect, setOpenList }: SearchResultsProps){
    const [products, setProducts] = React.useState<Products[]>([]);
    const [isLoading, setLoading] = React.useState(false)
    const [value, setValue] = React.useState("")

    const [debouncedValue] = useDebounce(query, 200);

    const fetchData = React.useCallback(async() => {
        setLoading(true);
        const products = await searchProducts({
          name: debouncedValue
        });
        setLoading(false);
        setProducts(products.products);
    }, [debouncedValue])

    React.useEffect(() => {
        fetchData();
    }, [debouncedValue, fetchData]);

    return (
        <CommandList>
            {isLoading && <CommandEmpty>Loading.</CommandEmpty>}
            <CommandGroup>
                {products.map((product) => {
                    return (

                    <CommandItem
                        key={product.id}
                        value={product.id.toString()}
                        onSelect={(currentValue) => {
                            setOpenList(false)
                            onSelect({...product, quantity: 1, selected: true})
                        }}
                        onClick={() => onSelect({...product, quantity: 1, selected: true})}
                    >
                    {`${product.name} ($${product.price})`}
                    <CheckIcon
                        className={cn(
                        "ml-auto h-4 w-4",
                        value === product.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                    />
                    </CommandItem>
                    );
                })}
            </CommandGroup>
        </CommandList>
    )
}
