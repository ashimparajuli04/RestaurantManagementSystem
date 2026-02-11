"use client"

import { useEffect, useState } from "react"
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Table } from "@/types/table"
import api from "@/lib/api"

export default function DashboardPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTables() {
      try {
        const res = await api.get<Table[]>("/tables/")
        setTables(res.data)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.detail || "Failed to load tables")
      } finally {
        setLoading(false)
      }
    }

    loadTables()
  }, [])

  if (loading) {
    return <div className="flex justify-center mt-10">Loading tables...</div>
  }

  if (error) {
    return <div className="flex justify-center mt-10 text-red-500">{error}</div>
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full bg-nj-cream flex justify-end">
        <Button className="flex items-center my-5 mr-5 gap-2">
          <Plus />
          Create Order
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 my-5 items-center justify-center">
        {tables.map((table) => (
          <div
            key={table.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
          >
            <TableCard table={table} />
          </div>
        ))}
      </div>
    </div>
  )
}
