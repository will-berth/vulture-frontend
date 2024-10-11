'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Navbar(){
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
            href="/pos"
            className={`${pathname === '/pos' ? 'bg-muted text-foreground text-primary' : 'text-muted-foreground'} flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary`}
            >
                <Home className="h-4 w-4" />
                Punto de Venta
            </Link>
            <Link
            href="/inventory"
            className={`${pathname === '/inventory' ? 'bg-muted text-foreground text-primary' : 'text-muted-foreground'} flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary`}
            >
                <Package className="h-4 w-4" />
                Inventario{" "}
            </Link>
            <Link
            href="/stats"
            className={`${pathname === '/stats' ? 'bg-muted text-foreground text-primary' : 'text-muted-foreground'} flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary`}
            >
                <LineChart className="h-4 w-4" />
                Estadística
            </Link>
        </nav>
    );
}