'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Plus, Coffee, Home, Building2, ShoppingBag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/api" 
import { useAuth } from "@/providers/auth-provider"

type TableType = "indoor" | "rooftop" | "takeaway"

type Table = {
  id: number
  number: number
  is_occupied: boolean
  type: TableType
  active_session_id: number | null
  customer_name: string | null
  customer_arrival: string | null
}

export default function DashboardPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [tableNumber, setTableNumber] = useState("")
  const [tableType, setTableType] = useState<TableType>("indoor")
  
  const { data: tables, isLoading, error } = useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get("/tables/")
      return res.data
    },
  })

  const createTableMutation = useMutation({
    mutationFn: async (data: { number: number; type: TableType }) => {
      await api.post("/tables/add-table", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] })
      setCreateDialogOpen(false)
      setTableNumber("")
      setTableType("indoor")
    },
  })

  const handleCreateTable = () => {
    const number = parseInt(tableNumber)
    if (!isNaN(number) && number > 0) {
      createTableMutation.mutate({ number, type: tableType })
    }
  }

  const occupiedCount = tables?.filter(t => t.is_occupied).length || 0
  const totalCount = tables?.length || 0

  // Group tables by type
  const indoorTables = tables?.filter(t => t.type === "indoor") || []
  const rooftopTables = tables?.filter(t => t.type === "rooftop") || []
  const takeawayTables = tables?.filter(t => t.type === "takeaway") || []

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

  const TableSection = ({ 
    title, 
    icon: Icon, 
    tables, 
    type 
  }: { 
    title: string
    icon: any
    tables: Table[]
    type: TableType
  }) => {
    if (tables.length === 0) return null
    
    const occupiedInSection = tables.filter(t => t.is_occupied).length

    return (
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-stone-700" />
            <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
              {title}
            </h2>
            <span className="text-sm text-stone-600">
              ({occupiedInSection} of {tables.length} occupied)
            </span>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <div className="bg-white border-b border-stone-200">
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
            
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-stone-800 hover:bg-stone-900 text-white font-semibold px-6 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={user?.role !== 'admin'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Table
                </Button>
              </DialogTrigger>
              <DialogContent className="border-stone-200">
                <DialogHeader>
                  <DialogTitle className="text-stone-900">Create New Table</DialogTitle>
                  <DialogDescription className="text-stone-600">
                    Add a new table to your restaurant
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="table-number" className="text-stone-700">Table Number</Label>
                    <Input
                      id="table-number"
                      type="number"
                      placeholder="e.g., 1"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="border-stone-300 focus:border-stone-500"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="table-type" className="text-stone-700">Table Type</Label>
                    <Select value={tableType} onValueChange={(value: TableType) => setTableType(value)}>
                      <SelectTrigger className="border-stone-300">
                        <SelectValue placeholder="Select table type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Indoor
                          </div>
                        </SelectItem>
                        <SelectItem value="rooftop">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Rooftop
                          </div>
                        </SelectItem>
                        <SelectItem value="takeaway">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Takeaway
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    className="border-stone-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTable}
                    disabled={createTableMutation.isPending || !tableNumber}
                    className="bg-stone-800 hover:bg-stone-900 text-white"
                  >
                    {createTableMutation.isPending ? "Creating..." : "Create Table"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Tables Sections */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Indoor Tables */}
        <TableSection 
          title="Indoor Tables"
          icon={Home}
          tables={indoorTables}
          type="indoor"
        />

        {/* Rooftop Tables */}
        <TableSection 
          title="Rooftop Tables"
          icon={Building2}
          tables={rooftopTables}
          type="rooftop"
        />

        {/* Takeaway Tables */}
        <TableSection 
          title="Takeaway"
          icon={ShoppingBag}
          tables={takeawayTables}
          type="takeaway"
        />
      </div>
    </div>
  )
}