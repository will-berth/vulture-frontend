"use client"

import * as React from "react"
import {
  ChevronDownIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Products = {
    id: number;
    name: string;
    price: number;
    quantity?: number;
    selected?: boolean;
}

interface ProductsTableProps {
    products: Products[];
    quantityHandler: (event: any, productId: number) => void;
}

export function ProductsTable({ products, quantityHandler }: ProductsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<Products>[] = React.useMemo(() => {
    return [
        // { TODO: completar funcionalidad del checkbox
        //   id: "select",
        //   accessorKey: "selected",
        //   header: ({ table }) => (
        //     <Checkbox
        //       checked={
        //         table.getIsAllPageRowsSelected() ||
        //         (table.getIsSomePageRowsSelected() && "indeterminate")
        //       }
        //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //       aria-label="Select all"
        //     />
        //   ),
        //   cell: ({ row }) => (
        //     <Checkbox
        //       // checked={row.original.selected}
        //       checked={row.getIsSelected()}
        //       onCheckedChange={(value) => {
        //         // console.log('change', row.getValue('selected'))
        //         // row.original.selected = !!value;
        //         row.toggleSelected(!!value)
        //       }}
        //       aria-label="Select row"
        //     />
        //   ),
        //   enableSorting: false,
        //   enableHiding: false,
        // },
        {
          accessorKey: "name",
          header: "Producto",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
          ),
        },
        {
          accessorKey: "price",
          header: () => <div className="text-right">Precio por unidad</div>,
          cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
      
            const formatted = new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(amount)
      
            return <div className="text-right font-medium">{formatted}</div>
          },
        },
        {
          accessorKey: "quantity",
          header: () => <div className="text-right">Cantidad</div>,
          cell: ({row}) => {
              return (
                  <div className="flex items-end">
                      <Input 
                        type="number" 
                        value={row.original?.quantity} 
                        className="w-1/3 sm:w-1/3 lg:w-1/4 ml-auto" 
                        onChange={(e) => quantityHandler(e, row.original.id)}/>
                  </div>
              )
          }
        }
    ]
  }, [])

  const table = useReactTable({
    data: products,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No has agregado productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} Producto(s) seleccionados.
        </div>
      </div>
    </div>
  )
}
