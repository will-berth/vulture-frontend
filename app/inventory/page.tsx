import DashboardLayout from "../dashboardLayout";
import { InventoryMain } from "@/components/inventory/InventoryMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "KFE - Inventario",
};

function Inventory(){
    return (
        <DashboardLayout>
            <InventoryMain/>
        </DashboardLayout>
    )
}
  
  export default Inventory