'use client'
import { useQuery } from '@tanstack/react-query'
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Plus, Coffee } from "lucide-react"
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

  const occupiedCount = tables?.filter(t => t.is_occupied).length || 0
  const totalCount = tables?.length || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Coffee className="h-10 w-10 mx-auto text-stone-800 animate-pulse" />
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Error loading tables</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <div className="bg-white rounded-b-2xl border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Coffee className="h-6 w-6 text-stone-800" />
                <div className="h-1 w-12 bg-stone-800" />
              </div>
              <h1 className="text-4xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                Tables
              </h1>
              <p className="text-stone-600 text-sm">
                {occupiedCount} of {totalCount} occupied
              </p>
            </div>
            
            <Button 
              className="bg-stone-800 hover:bg-stone-900 text-white font-semibold px-6 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Section - Coming Soon */}
      {/* 
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border-2 border-stone-200 p-6">
          <ChartBarDefault />
        </div>
      </div>
      */}

      {/* Tables Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables?.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      </div>
    </div>
  )
}