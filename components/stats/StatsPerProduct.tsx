"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { RangeCalendar } from "./CalendarFilter"
import { getStatsByProduct, searchProductsByName } from "@/services/api"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

const chartConfig = {
    sales: {
        label: "Ventas",
    },
    total_sales: {
        label: "Total",
        color: "hsl(var(--chart-1))",
    },
    sales_by_cash: {
        label: "Efectivo",
        color: "hsl(var(--chart-2))",
    },
    sales_by_credit_card: {
        label: "Credito/Debito",
        color: "hsl(var(--chart-3))",
    },
    sales_by_bank_transfer: {
        label: "Transferencias",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig

interface ChartData {
    sales_date: string;
    total_sales: string;
    sales_by_cash: string;
    sales_by_credit_card: string;
    sales_by_bank_transfer: string;
}

interface ProductResponse {
    id: number;
    name: string;
}


export function StatsPerProduct() {
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("total_sales")
    const [productId, setProductId] = useState(0);
    const [rangeDate, setRangeDate] = useState({});
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const total = useMemo(() => ({
        total_sales: chartData.reduce((acc, curr) => acc + parseInt(curr.total_sales, 10), 0),
        sales_by_cash: chartData.reduce((acc, curr) => acc + parseInt(curr.sales_by_cash, 10), 0),
        sales_by_credit_card: chartData.reduce((acc, curr) => acc + parseInt(curr.sales_by_credit_card, 10), 0),
        sales_by_bank_transfer: chartData.reduce((acc, curr) => acc + parseInt(curr.sales_by_bank_transfer, 10), 0)
    }), [chartData]);

    const initFetch = useCallback(async() => {
        const [statsByProduct, productsResponse] = await Promise.all([
            getStatsByProduct(productId, rangeDate),
            searchProductsByName('')
        ]);
        setProducts(productsResponse);
        setChartData(statsByProduct);
    }, [productId, rangeDate])
    
    useEffect(() => {
        initFetch();
    }, [productId, rangeDate, initFetch])

    const tableFiltersHandler = async(data: any) => {
        setRangeDate(data);
    }

    const productSelectorHandler = async(value: string) => {
        setProductId(Number(value))
    }

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="mb-2">Ventas por producto</CardTitle>
                    <RangeCalendar applyFilter={tableFiltersHandler}/>
                    <Select onValueChange={productSelectorHandler}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecciona un producto" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Productos</SelectLabel>
                            {
                                products.map(product => (
                                    <SelectItem value={product.id.toString()}>{product.name}</SelectItem>
                                ))
                            }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex">
                {["total_sales", "sales_by_cash", "sales_by_credit_card", "sales_by_bank_transfer"].map((key) => {
                    const chart = key as keyof typeof chartConfig
                    return (
                    <button
                        key={chart}
                        data-active={activeChart === chart}
                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                        onClick={() => setActiveChart(chart)}
                    >
                        <span className="text-xs text-muted-foreground">
                        {chartConfig[chart].label}
                        </span>
                        <span className="text-sm font-bold leading-none">
                        {total[key as keyof typeof total].toLocaleString()}
                        </span>
                    </button>
                    )
                })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
                >
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                    left: 12,
                    right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="sales_date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        })
                    }}
                    />
                    <ChartTooltip
                    content={
                        <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="sales"
                        labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            })
                        }}
                        />
                    }
                    />
                    <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
