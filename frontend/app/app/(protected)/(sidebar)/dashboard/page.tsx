'use client'

import { useQuery } from '@tanstack/react-query'
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { ChartBarDefault } from '@/components/bar-chart'
import { Plus } from "lucide-react"
import api from "@/lib/api" 

type Table = {
  id: number
  number: number
  is_occupied: boolean
  active_session_id: number | null
  customer_name: string | null
  customer_arrival: string | null
}

export default function DashboardPage() {

  const { data: tables, isLoading, error } = useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get("/tables/")
      return res.data
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading tables</div>

  return (
    <div className="w-full h-screen">
      <div className="w-full bg-nj-cream">
        {/* Button row - like a navbar */}
        <div className="flex justify-end p-5">
          <Button className="flex items-center gap-2">
            <Plus />
            Create Order
          </Button>
        </div>
        
        {/* Chart below - constrained width */}
        <div className="flex items-start max-w-4xl mx-auto p-5">
          <ChartBarDefault />
        </div>
      </div>
      
      

      <div className="flex flex-wrap gap-4 my-5 items-center justify-center">
        {tables?.map((table) => (
          <div key={table.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <TableCard table={table} />
          </div>
        ))}
      </div>
    </div>
  )
}
