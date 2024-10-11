import DashboardLayout from "../dashboardLayout";
import { StatsMain } from "@/components/stats/StatsMain";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "KFE - Estadísticas",
};

function Stas(){
    return (
        <DashboardLayout>
            <StatsMain/>
        </DashboardLayout>
    )
}
  
  export default Stas