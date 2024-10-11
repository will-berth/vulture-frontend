import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProductCombobox } from "./ProductCombobox";
import { ProductsTable } from "./ProductsTable";



interface Products {
    id: number;
    name: string;
    price: number;
    stock: number;
    quantity?: number;
}
interface SearchProductsProps{
    className?: string;
    onSelect: (product: any) => void;
    products: Products[];
    selectedProducts: Products[];
    quantityHandler: (event: any, productId: number) => void;
}

export function SearchProducts({ className, onSelect, products, selectedProducts, quantityHandler }: SearchProductsProps){
    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <ProductCombobox onSelect={onSelect} products={products}></ProductCombobox>
                        </div>
                    </div>
                </form>
                <ProductsTable 
                    products={selectedProducts}
                    quantityHandler={quantityHandler}/>
            </CardContent>
        </Card>
    );
}