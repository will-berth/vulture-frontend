import { CheckboxIcon, CopyIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useMemo } from "react";
import { RoundSpinner, SpokeSpinner } from "../ui/spinner";
import { DynamicForm } from "../DynamicForm";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

interface Products {
    id: number;
    name: string;
    price: number;
    stock: number;
    quantity: number;
    selected: boolean;
}

interface SendSalesInput {
    payment_method?: string;
}
interface SaleDetailProps{
    products: Products[];
    executeOnSubmit: (paymentMethod: SendSalesInput) => void;
    sendingSale: boolean;
}

const formSaleDetail = z.object({
    payment_method: z.enum(["cash", "credit_card", "bank_transfer"], {
        errorMap: () => ({message: "Selecciona un metodo de pago"})
    })
});

export function SaleDetail({ products, executeOnSubmit, sendingSale }: SaleDetailProps){
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(currentDate);

    const total = useMemo(() => {
        return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    }, [products])

    return (
        <DynamicForm
            schema={formSaleDetail}
            onSubmit={executeOnSubmit}
            renderComponent={(form) => (
                <>
                    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                        <CardHeader className="flex flex-row items-start bg-muted/50">
                            <div className="grid gap-0.5">
                                <CardTitle className="group flex items-center gap-2 text-lg">
                                Orden
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <CopyIcon className="h-3 w-3" />
                                    <span className="sr-only">Copy Order ID</span>
                                </Button>
                                </CardTitle>
                                <CardDescription>Fecha: {formattedDate}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 text-sm">
                            <div className="grid gap-3">
                                <div className="font-semibold">Detalles de Venta</div>
                                {
                                    products.length == 0
                                    ? (<span className="text-muted-foreground">Selecciona productos para ver los detalles</span>)
                                    : (<>
                                        <ul className="grid gap-3">
                                            {
                                                products.map((product, index) => (
                                                    <li key={product.id} className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">
                                                        {product.name} x <span>{product.quantity}</span>
                                                        </span>
                                                        <span>${(product.price * product.quantity).toFixed(2)}</span>
                                                    </li>
                                                ))
                                            }
                                            </ul>
                                            <Separator className="my-2" />
                                            <ul className="grid gap-3">
                                            <li className="flex items-center justify-between font-semibold">
                                                <span className="text-muted-foreground">Total</span>
                                                <span>${total.toFixed(2)}</span>
                                            </li>
                                        </ul>
                                    </>)
                                    
                                }
                            </div>
                        <Separator className="my-4" />
                            <FormField
                                control={form.control}
                                name="payment_method"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Metodo de pago</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cash">Efectivo</SelectItem>
                                                <SelectItem value="credit_card">Tarjet de Credito/Debito</SelectItem>
                                                <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-row items-end border-t bg-muted/50 px-6 py-5">
                            <Button size={'lg'} type="submit" className="w-full">
                                {sendingSale ? (
                                    <SpokeSpinner color="black"/> 
                                ): (
                                    <>
                                        <CheckboxIcon className="mr-2 h-6 w-6" /> Generar Venta
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </>
            )}
        />
    );
}