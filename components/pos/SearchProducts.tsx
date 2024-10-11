import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ProductCombobox } from "./ProductCombobox";
import { ProductsTable } from "./ProductsTable";

interface SearchProductsProps{
    className?: string;
}

const products = [
    {
      id: 1,
      name: "Cafe Negro",
      price: 23.4
    },
    {
        id: 2,
        name: "Te Negro",
        price: 18.1
    },
]

export function SearchProducts({ className }: SearchProductsProps){
    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <ProductCombobox/>
                        </div>
                    </div>
                </form>
                <ProductsTable/>
            </CardContent>
            {/* <CardFooter>
                <Button variant="outline">Agregar a Orden</Button>
            </CardFooter> */}
        </Card>
    );
}