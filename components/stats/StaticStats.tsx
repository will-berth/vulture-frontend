"use client"

import { DollarSign } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StaticStatsProps{
    title: string;
    content: string;
    subContent: string;
    icon: React.ReactNode;
}

export default function StaticStats({title, content, subContent, icon}: StaticStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
        <p className="text-xs text-muted-foreground">{subContent}</p>
      </CardContent>
    </Card>
  )
}
