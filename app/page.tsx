import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dashboard } from "@/components/Dashboard";
import Link from 'next/link'


function HomePage(){
  return (
    <div>
      <Button >Ir a Dashboard</Button>
      <Link href="/inventory">Dashboard</Link>
    </div>
  )
}

export default HomePage