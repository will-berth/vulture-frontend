'use client'
import { Button } from "@/components/ui/button"
import { getCategories, registerProduct, searchProducts, searchProductsByName } from "@/services/api";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { DynamicForm } from "../DynamicForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { InventoryTable } from "./InventoryTable";
import { toast } from "sonner";
import { SpokeSpinner } from "../ui/spinner";

interface Product{
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    created_at: Date;
    category?: string;
}

interface Category{
    id: number;
    name: string;
}

interface RegisterProductInput{
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
}

interface FilterProducts{
    page?: number;
    limit?: number;
    name?: string;
    category_ids?: string;
    created_at?: Date;
    price_min?: string;
    price_max?: string;
    stock_min?: string;
    stock_max?: string;
    date_time?: number;
}

const formRegisterProduc = z.object({
    name: z.string().min(2, {
        message: "El nombre del producto debe tener al menos 2 caracteres."
    }),
    description: z.string().min(10, {
        message: "La descripción debe tener al menos 10 caracteres."
    }),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "El precio debe ser un número positivo.",
    }),
    stock: z.string().refine((val) => !isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) >= 0, {
        message: "El stock debe ser un número entero no negativo.",
    }),
    category_id: z.string({
        message: "Debes seleccionar una categoria para el producto."
    })
});

export function InventoryMain(){
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [sendingProduct, setSendingProduct] = useState(false);
    const [existsProducts, setExistsProducts] = useState(false);
    const [filters, setFilters] = useState<FilterProducts>({});

    const fetchProductsDataInit = useCallback(async()=> {
        const [products, categories] = await Promise.all([
            searchProducts(filters),
            getCategories()
        ]);
        setCategories(categories)
        setProducts(products.products);
        setExistsProducts(products.existsProducts)
    }, [filters])

    useEffect(() => {
        fetchProductsDataInit();
    }, [filters, fetchProductsDataInit]);

    const registerProductOnSubmit = async(value: RegisterProductInput, setModalState: Dispatch<SetStateAction<boolean>>) => {
        try{
            setSendingProduct(true);
            const response = await registerProduct(value);
            setTimeout(() => {
                const date = new Date('2023-12-03T09:00:00');
                const formattedDate = new Intl.DateTimeFormat('es-ES', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,  
                }).format(date);
                setSendingProduct(false);
                setIsOpen(false);
                toast("Se registró el producto exitosamente", {
                  description: formattedDate,
                  action: {
                    label: "Cerrar",
                    onClick: () => console.log("Cerrar"),
                  },
                })
                fetchProductsDataInit()
                setModalState(false)
            }, 3000);

        }catch(error){
            toast("Ocurrio un error al registrar la venta", {
                description: "Intente nuevamente",
                action: {
                  label: "Cerrar",
                  onClick: () => console.log("Cerrar"),
                },
            })
            setSendingProduct(false);
        }
    }

    const filterHandler = (filters: FilterProducts) => {
        setFilters(filters)
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Inventario</h1>
            </div>
            {
                (products.length === 0 && !existsProducts)
                ? (
                    <div
                        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                    >
                        <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            No tienes productos registrados
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Puedes empezar a vender tan pronto como agregues un producto.
                        </p>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="mt-4">Agregar Producto</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] md:max-w-[400px] lg:max-w-[400px] w-[90vw]">
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                                </DialogHeader>
                                <DynamicForm
                                    schema={formRegisterProduc}
                                    onSubmit={(value) => {
                                        registerProductOnSubmit(value, setIsOpen)
                                    }}
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
                ) : (
                    <InventoryTable
                        schema={formRegisterProduc}
                        onSubmit={registerProductOnSubmit}
                        categories={categories}
                        products={products}
                        sendingProduct={sendingProduct}
                        filterHandler={filterHandler}
                    />
                )
            }
        </main>
    )
}