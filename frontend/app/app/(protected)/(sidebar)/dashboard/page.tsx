'use client'

import { useQuery } from '@tanstack/react-query'
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import api from "@/lib/api"   // your axios instance
import type { Table } from "@/types/table"

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
      <div className="w-full bg-nj-cream flex justify-end">
        <Button className="flex items-center my-5 mr-5">
          <Plus />
          Create Order
        </Button>
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
