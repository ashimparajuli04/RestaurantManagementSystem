'use client'
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Utensils, ChevronRight } from "lucide-react"

type Table = {
  id: number
  number: number
  is_occupied: boolean
  active_session_id: number | null
  customer_name: string | null
  customer_arrival: string | null
}

export function TableCard({ table }: { table: Table }) {
  const router = useRouter()
  
  const getTimeElapsed = (arrival: string) => {
    const arrivalTime = new Date(arrival)
    const now = new Date()
    const diffMs = now.getTime() - arrivalTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins}m`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }
  
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/table-sessions/", { table_id: table.id })
      return res.data
    },
    onSuccess: (data) => {
      router.push(`/table-session/${data.id}`)
    },
  })

  const isOccupied = table.is_occupied

  return (
    <Card className={`
      group relative overflow-hidden transition-all duration-300 hover:shadow-xl
      ${isOccupied 
        ? "bg-linear-to-br from-amber-50 via-white to-orange-50/30 border-amber-200 hover:border-amber-300" 
        : "bg-linear-to-br from-emerald-50 via-white to-teal-50/30 border-emerald-200 hover:border-emerald-400"
      }
    `}>
      {/* Decorative corner accent */}
      <div className={`
        absolute top-0 right-0 w-24 h-24 opacity-10
        ${isOccupied ? "bg-amber-500" : "bg-emerald-500"}
        transform rotate-45 translate-x-12 -translate-y-12
        transition-transform duration-300 group-hover:scale-110
      `} />
      
      {/* Animated status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className={`
          relative h-2.5 w-2.5 rounded-full
          ${isOccupied ? "bg-amber-500" : "bg-emerald-500"}
        `}>
          {isOccupied && (
            <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75" />
          )}
        </div>
      </div>

      <div className="relative p-5">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`
              p-2 rounded-xl transition-colors
              ${isOccupied 
                ? "bg-amber-100 text-amber-600" 
                : "bg-emerald-100 text-emerald-600"
              }
            `}>
              <Utensils className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Table {table.number}</h3>
          </div>
          
          <Badge className={`
            font-semibold tracking-wide text-xs px-3 py-1
            ${isOccupied 
              ? "bg-amber-500 text-white hover:bg-amber-600 border-0" 
              : "bg-emerald-500 text-white hover:bg-emerald-600 border-0"
            }
          `}>
            {isOccupied ? "OCCUPIED" : "AVAILABLE"}
          </Badge>
        </div>

        {/* Info Section */}
        <div className={`
          min-h-18 mb-4 p-3 rounded-lg transition-colors
          ${isOccupied 
            ? "bg-white/60 backdrop-blur-sm border border-amber-100" 
            : "bg-white/40 backdrop-blur-sm border border-emerald-100"
          }
        `}>
          {isOccupied ? (
            <div className="space-y-2.5">
              {table.customer_name && (
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-sm">{table.customer_name}</span>
                </div>
              )}
              {table.customer_arrival && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {new Date(table.customer_arrival).toLocaleTimeString("en-NP", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Kathmandu",
                    })}
                  </span>

                  <span className="ml-auto bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                    {getTimeElapsed(table.customer_arrival)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500 font-medium italic">Ready for new guests</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {isOccupied ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold border-2 hover:bg-gray-50 group/btn"
                onClick={() => router.push(`/table-session/${table.active_session_id}`)}
              >
                View Orders
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="font-semibold border-2 border-amber-300 text-amber-600 hover:bg-amber-600 hover:text-white transition-all"
                onClick={() => router.push(`/checkout/${table.active_session_id}`)}
              >
                Checkout
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              onClick={() => createSessionMutation.mutate()}
              disabled={createSessionMutation.isPending}
            >
              {createSessionMutation.isPending ? "Creating..." : "Start Session"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}