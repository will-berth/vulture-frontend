'use client'
import { SearchProducts } from "./SearchProducts"
import { SaleDetail } from "./SaleDetail"
import { useState } from "react"
import { sendSales } from "@/services/api"
import { toast } from "sonner"

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  selected: boolean;
}

interface SaleDetail{
  product_id: number;
  quantity: number
}

interface SendSalesInput {
  payment_method?: string;
  products?: SaleDetail[];
}

export function PosMain() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(prevProducts => {
      const index = prevProducts.findIndex(p => p.id === product.id)

      if(index === -1){
        return [...prevProducts, product]
      }
      const updatedProducts = [...prevProducts];
      const updatedProduct = { ...updatedProducts[index], quantity: updatedProducts[index].quantity + 1 };
      updatedProducts[index] = updatedProduct;
      return updatedProducts;
    });
  };

  const handleQuantityChange = (event: any, productId: number) => {
    const newQuantity = parseInt(event.target.value, 10);

    setSelectedProduct((prevData) => 
      prevData.map((product) =>
        product.id === productId ? {...product, quantity: newQuantity} : product
      )
    );
  }

  const sendSaleOnSubmit = async({payment_method}: SendSalesInput) => {
    try{
      setLoading(true);
      const saleDetail: SaleDetail[] = selectedProduct.map(p => ({product_id: p.id, quantity: p.quantity})); 
      const response = await sendSales({
        payment_method: payment_method as string,
        products: saleDetail
      });
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
        setLoading(false);
        setSelectedProduct([]);
        toast("Se registró la venta exitosamente", {
          description: formattedDate,
          action: {
            label: "Cerrar",
            onClick: () => console.log("Cerrar"),
          },
        })
      }, 3000);
    } catch(error){
      toast("Ocurrio un error al registrar la venta", {
        description: "Intente nuevamente",
        action: {
          label: "Cerrar",
          onClick: () => console.log("Cerrar"),
        },
      })
      setLoading(false);
    }
  }
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mt-4">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              <SearchProducts 
                className="sm:col-span-4" 
                onSelect={handleSelectProduct} 
                products={products} 
                selectedProducts={selectedProduct}
                quantityHandler={handleQuantityChange}/>
            </div>
          </div>
          <div>
            <SaleDetail 
              products={selectedProduct}
              executeOnSubmit={sendSaleOnSubmit}
              sendingSale={loading}/>
          </div>
        </main>
    );
}