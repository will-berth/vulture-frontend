interface SaleDetail{
    product_id: number;
    quantity: number
}

interface SendSalesInput {
    payment_method: string;
    products: SaleDetail[];
}

interface Product {
    category_id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}

interface QueryFilter{
    name?: string;
    limit?: number;
    page?: number;
    category_ids?: string;
    created_at?: Date;
    price_min?: string;
    price_max?: string;
    stock_min?: string;
    stock_max?: string;
    start_date?: Date;
    end_date?: Date;
}

interface DateRangeFilter{
    start_date: Date;
    end_date: Date;
}

export const searchProductsByName = async (name: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?name=${name}`);
    const data = await response.json();
    return data.products;
}

export const searchProducts = async (query: QueryFilter = {}) => {
    const queryString = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
            queryString.append(key, value.toString());
        }
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryString}`);
    const data = await response.json();
    return data;
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

export const getCategories = async() => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`);
    const data = await response.json();
    return data.categories;
}

export const registerProduct = async(product: Product) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product),
    });

    if(response.status !== 200) throw new Error('Error: register product')
    const data = await response.json();
    return data;
}

export const getSales = async (query: QueryFilter) => {
    const queryString = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
            queryString.append(key, value.toString());
        }
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales?${queryString}`);
    const data = await response.json();
    return data.sales;
}

export const getStaticStats = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/statics`);
    const data = await response.json();
    return data.stats;
}

export const getTopProducts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/top-products`);
    const data = await response.json();
    return data.stats;
}

export const getStatsByProduct = async (id: number, query: QueryFilter) => {
    const queryString = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
            queryString.append(key, value.toString());
        }
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/product/${id}?${queryString}`);
    const data = await response.json();
    return data.stats;
}