"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components//ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components//ui/chart"
import { Separator } from "@/components//ui/separator"
import { TrendingUp } from "@mynaui/icons-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import StaticStats from "./StaticStats"
import { TopStats } from "./TopStats"
import { DynamicTable } from "../DynamicTable"
import { ColumnDef } from "@tanstack/react-table"
import { RangeCalendar } from "./CalendarFilter"
import { getSales, getStaticStats } from "@/services/api"
import { Activity, CreditCard, DollarSign } from "lucide-react"
import { StatsPerProduct } from "./StatsPerProduct"


interface Sale{
  sale_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: Date;
}

const columns: ColumnDef<Sale>[] = [
  {
      accessorKey: "sale_id",
      header: "ID de venta",
  },
  {
      accessorKey: "product_id",
      header: "ID de producto",
  },
  {
      accessorKey: "name",
      header: "Producto",
  },
  {
      accessorKey: "quantity",
      header: "Cantidad de compra",
      cell: ({row}) => {
        return <div className="text-center">{row.getValue('quantity')}</div>
      }
  },
  {
      accessorKey: "price",
      header: "Precio de venta",
      cell: ({row}) => {
        return <div className="text-center">${row.getValue('price')}</div>
      }
  },
  {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: ({row}) => {
        return <div className="text-center">${row.getValue('subtotal')}</div>
      }
  },
  {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) => {
        const createdAt = new Date(row.getValue('created_at'))
        const formatted = new Intl.DateTimeFormat("es-Es", {
            weekday: 'long',
            year: 'numeric', 
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,  
        }).format(createdAt)
        return <div className="font-medium">{formatted}</div>
    },
  }
]

interface StaticStats {
  sales?: number;
  sales_percentage_change?: number;
  earning?: number;
  earning_percentage_change?: number;
  total_added?: number;
  added_this_month?: number;
}


export function StatsMain() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [staticStats, setStaticStats] = useState<StaticStats>({
    sales: 0,
    sales_percentage_change: 0,
    earning: 0,
    earning_percentage_change: 0,
    total_added: 0,
    added_this_month: 0
  });

  const getSalesFetch = useCallback(async() => {
    const [salesResponse, staticStatsResponse] = await Promise.all([
      getSales({}),
      getStaticStats()
    ]);
    setStaticStats(staticStatsResponse)
    setSales(salesResponse);
  }, [])

  useEffect(() => {
    getSalesFetch();
  }, [])


  const tableFiltersHandler = async(data: any) => {
    const response = await getSales(data);
    setSales(response);
  }

  return (
    <>
      <div className="chart-wrapper flex max-w-6xl flex-col flex-wrap items-start justify-start gap-6 p-6 sm:flex-row sm:p-8">
        <div className="grid grid-cols-4 gap-6 w-full">
          <div className="col-span-4 sm:col-span-4 md:col-span-1 lg:col-span-1">
            <StaticStats
              title="Ganancias"
              content={`$${staticStats.earning}`}
              subContent={`${Number(staticStats.earning_percentage_change).toFixed(2)}% respecto al mes anterior`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            >
            </StaticStats>
          </div>
          <div className="col-span-4 sm:col-span-4 md:col-span-1 lg:col-span-1">
            <StaticStats
              title="Ventas"
              content={`${staticStats.sales}`}
              subContent={`${Number(staticStats.sales_percentage_change).toFixed(2)}% respecto al mes anterior`}
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            >
            </StaticStats>
          </div>
          <div className="col-span-4 sm:col-span-4 md:col-span-1 lg:col-span-1">
            <StaticStats
              title="Productos totales"
              content={`${staticStats.total_added}`}
              subContent={`+${staticStats.added_this_month} productos el ultimo mes`}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            >
            </StaticStats>
          </div>
          <div className="col-span-4 sm:col-span-4 md:col-span-1 lg:col-span-1">
            <TopStats/>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-3">
            <StatsPerProduct/>
          </div>
          {/* <div className="col-span-3 sm:col-span-3 md:col-span-3 lg:col-span-1">
            <TopStats/>
          </div> */}
        </div>
        <div className="grid grid-cols-1 w-full">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-row justify-between">
                  <CardTitle>Ventas</CardTitle>
                  <RangeCalendar applyFilter={tableFiltersHandler}/>
                </div>
              </CardHeader>
              <CardContent>
                <DynamicTable
                  columns={columns}
                  data={sales}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
