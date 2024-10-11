import DashboardLayout from "../dashboardLayout";
import { PosMain } from "@/components/pos/PosMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "KFE - Punto de Venta",
};

function Inventory(){
    return (
        <DashboardLayout>
            <PosMain/>
        </DashboardLayout>
    )
}
  
  export default Inventory