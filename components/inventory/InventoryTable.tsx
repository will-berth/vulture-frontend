import Image from "next/image"
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCallback, useEffect, useState } from "react"
import { getCategories, searchProducts } from "@/services/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import FilterDropdown from "./Filters"
import { DynamicTable } from "../DynamicTable"
import { ColumnDef } from "@tanstack/react-table"
import { CategoryFilter } from "./CategoryFilter"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DynamicForm } from "../DynamicForm"
import { ZodSchema } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { SpokeSpinner } from "../ui/spinner"
import { toast } from "sonner"

interface Category{
    id: number;
    name: string;
}

type Product = {
    id: number
    name: string
    price: number
    stock: number
    category?: string
    description?: string
    created_at?: Date
}

const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "price",
        header: "Precio",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            }).format(price)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
    },
    {
        accessorKey: "description",
        header: "Descripcion",
    },
    {
        accessorKey: "created_at",
        header: "Fecha de registro",
        cell: ({ row }) => {
            const createdAt = new Date(row.getValue('created_at'))
            const formatted = new Intl.DateTimeFormat("es-Es", {
                weekday: 'long',
                year: 'numeric', 
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,  
            }).format(createdAt)
            return <div className="font-medium">{formatted}</div>
        },
    },
  ]
  

interface InventoryTableProps{
    schema: ZodSchema;
    onSubmit: (data: any, setModalState: any) => void;
    categories: Category[];
    products: Product[];
    sendingProduct: boolean;
    filterHandler: (filter: any) => void;
}

interface Filters {
    category_ids?: string;
    created_at?: Date;
    name?: string;
    price_min?: string;
    price_max?: string;
    stock_min?: string;
    stock_max?: string;
}

export function InventoryTable({schema, onSubmit, categories, products, sendingProduct, filterHandler}: InventoryTableProps){
    const [categoriesSelect, setCategoriesSelect] = useState<Category[]>([]);
    const [categoriesIdsSelected, setCategoriesIdsSelector] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [filterProducts, setFilters] = useState<Filters>({});


    const fetchCategories = useCallback(async() => {
        const response = await getCategories();
        setCategoriesSelect(response);
    }, [])

    useEffect(() => {
        fetchCategories();
    }, []);

    
    const handlePageChange = (page: number) => {
        console.log(`Página cambiada a: ${page}`)
    }

    const categoriesSelectorHandler = (id: number) => {
        setCategoriesIdsSelector((prev: any) => {
            if (prev.includes(id)) {
                return prev.filter((n: any) => n !== id);
            } else {
                return [...prev, id];
            }
        });

        const categoryIds = categoriesIdsSelected.join(',')
        setFilters({...filterProducts, category_ids: categoryIds})
        // filterProducts.category_ids = categoryIds
        filterHandler(filterProducts)


    };

    const registerProductOnSubmit = (value: any) => {
        onSubmit(value, setIsOpen)
    }

    const filterProductsOnSubmit = async(filters: Filters) => {
        const categoryIds = categoriesIdsSelected.join(',')
        setFilters({...filters, category_ids: categoryIds})
        filterHandler(filterProducts);
    }

    return (
        <div className="container">
            <div className="flex items-center">
                
                {/* Button */}
                {/* <Button variant="ghost" className="border border-dashed shadow-sm">
                    <PlusCircle className="h-3.5 w-3.5 mr-2"/>
                    Categorias
                </Button> */}
                <CategoryFilter
                    selectorName="Categorias"
                    selectors={categoriesSelect}
                    selectorHandler={categoriesSelectorHandler}
                    selectorsActive={categoriesIdsSelected}
                />
                {/* Button my */}
                <div className="ml-auto flex items-center gap-2 mb-4">
                    <FilterDropdown
                        onFilterChange={filterProductsOnSubmit}
                    />

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-7 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Agregar Producto
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[400px] lg:max-w-[400px] w-[90vw]">
                            <DialogHeader>
                                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                            </DialogHeader>
                            <DynamicForm
                                schema={schema}
                                onSubmit={registerProductOnSubmit}
                                renderComponent={(form) => (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nombre del Producto</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="mt-3">
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Descripción</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <FormField
                                                control={form.control}
                                                name="category_id"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Categoria</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccionar categoria" />
                                                            </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    categories.map((category) => (
                                                                        <SelectItem value={`${category.id}`}>{category.name}</SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex flex-row mt-3">
                                            <div className="mr-2 sm:mr-0 md:mr-2 lg:mr-2">
                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Precio</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="number" min="0" step="0.01" />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="stock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Stock</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="number" min="0" />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type="submit" className="mt-4 w-full">
                                            {sendingProduct ? (
                                                <SpokeSpinner color="black"/> 
                                            ): (
                                                <>
                                                    Guardar Producto
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    <DynamicTable 
                        columns={columns} 
                        data={products} 
                        onPageChange={handlePageChange}
                    />
                </CardContent>
                <CardFooter>
                {/* <div className="text-xs text-muted-foreground">
                    Viendo <strong>1-10</strong> de <strong>32</strong>{" "}
                    productos
                </div> */}
                </CardFooter>
            </Card>
        </div>
    )
}