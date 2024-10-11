interface SaleDetail{
    product_id: number;
    quantity: number
}

interface SendSalesInput {
    payment_method: string;
    products: SaleDetail[];
}

export const searchProductsByName = async (name: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=20&page=1&name=${name}`);
    const data = await response.json();
    return data.products;
}

export const sendSales = async(saleDetail: SendSalesInput) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleDetail),
    })

    if(response.status !== 200) throw new Error('Error')
    const data = await response.json();
    return data;
}