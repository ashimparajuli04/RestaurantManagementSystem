'use client'

import { useEffect, useState } from "react"
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Table } from "@/types/table"

export default function DashboardPage() {
  const [tables, setTables] = useState<Table[]>([])

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("access_token")

      const res = await fetch("http://localhost:8000/tables/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) return

      const data = await res.json()
      setTables(data)
    }

    load()
  }, [])

  return (
    <div className="w-full h-screen">
      <div className="w-full bg-nj-cream flex justify-end">
        <Button className="flex items-center justify-cente my-5 mr-5">
          <Plus className="" />
          Create Order
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 my-5 items-center justify-center">
        {tables.map((table) => (
          <div key={table.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <TableCard table={table} />
          </div>
        ))}
      </div>
    </div>
    
  )
}
