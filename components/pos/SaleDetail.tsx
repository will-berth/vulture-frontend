import { CheckboxIcon, CopyIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";


export function SaleDetail(){
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(currentDate);
    return (
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
                    <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                        Cafe San Cristobal x <span>2</span>
                        </span>
                        <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                        Pastel de Nueces x <span>1</span>
                        </span>
                        <span>$49.00</span>
                    </li>
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                    <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span>$329.00</span>
                    </li>
                    </ul>
                </div>
            <Separator className="my-4" />
                <div className="grid gap-3">
                    <div className="font-semibold">Metodo de pago</div>
                    <dl className="grid gap-1">
                    <Select>
                        <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Seleciona un metodo de pago" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Metodos de Pago</SelectLabel>
                            <SelectItem value="cash">Efectivo</SelectItem>
                            <SelectItem value="credit_card">Tarjet de Credito/Debito</SelectItem>
                            <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                    </dl>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-end border-t bg-muted/50 px-6 py-5">
                <Button size={'lg'} type="submit" className="w-full">
                    <CheckboxIcon className="mr-2 h-6 w-6" /> Generar Venta
                </Button>
            </CardFooter>
        </Card>
    );
}