"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useCallback, useEffect, useState } from "react"
import { getTopProducts } from "@/services/api"

interface ChartData {
    product_id: number;
    request_id: string;
    name: string;
    quantity: number;
    fill?: string;
}

interface ChartConfigIt {
    [key: string]: {
        label: string;
        color: string;
    };
}


const chartFills = ["#2EB88A", "#E88C30", "#A552CF"]

export function TopStats() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfigIt>({});

    const fetchTop = useCallback(async() => {
        const topProducts: ChartData[] = await getTopProducts();
        let chartCf: ChartConfig = {
            quantity: {
                label: "Ventas"
            }
        }
        setChartData(topProducts.map((p, idx) => {
            chartCf[p.request_id] = {
                label: p.name,
                color: `hsl(var(--chart-${idx + 2}))`
            }
            return {
                ...p,
                fill: chartFills[idx]
            }
        }));

        setChartConfig(chartCf as ChartConfigIt);
    }, [])

    useEffect(() => {
        fetchTop();
    }, [])

    return (
        <Card>
        <CardHeader>
            <CardTitle>Top</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                left: 0,
                }}
            >
                <YAxis
                dataKey="request_id"
                type="category"
                tickLine={false}
                tickMargin={1}
                axisLine={false}
                tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                }
                />
                <XAxis dataKey="quantity" type="number" hide />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="quantity" layout="vertical" radius={5} fill="#000000" />
            </BarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
            3 productos mas vendidos <TrendingUp className="h-4 w-4" />
            </div>
        </CardFooter>
        </Card>
    )
}