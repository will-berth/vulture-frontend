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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function NavbarMobile(){
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">KFE</span>
                    </Link>
                    <Link
                        href="/pos"
                        className={`${pathname === '/pos' ? 'bg-muted text-foreground' : 'text-muted-foreground'} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground`}
                    >
                        <Home className="h-5 w-5" />
                        Punto de Venta
                    </Link>
                    <Link
                        href="/inventory"
                        className={`${pathname === '/inventory' ? 'bg-muted text-foreground' : 'text-muted-foreground'} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground`}
                    >
                        <Package className="h-5 w-5" />
                        Inventario
                    </Link>
                    <Link
                        href="/stats"
                        className={`${pathname === '/stats' ? 'bg-muted text-foreground' : 'text-muted-foreground'} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground`}
                    >
                        <LineChart className="h-5 w-5" />
                        Estadística
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}