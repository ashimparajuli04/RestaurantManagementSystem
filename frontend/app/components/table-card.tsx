import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Utensils } from "lucide-react"

type Table = {
  id: number
  number: number
  is_occupied: boolean
  active_session_id: number | null
  customer_name: string | null
  customer_arrival: string | null
}

export function TableCard({ table }: { table: Table }) {
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

  return (
    <Card
      className={`
        relative transition-all duration-200 hover:shadow-lg
        ${table.is_occupied 
          ? "border-l-4 border-l-amber-500 bg-amber-50/30" 
          : "border-l-4 border-l-emerald-500 bg-white hover:border-l-emerald-600"
        }
      `}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        <div 
          className={`
            h-3 w-3 rounded-full 
            ${table.is_occupied ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}
          `}
        />
      </div>

      <CardHeader className="pb-2 space-y-1 -mt-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Utensils className="h-5 w-5 text-muted-foreground" />
              Table {table.number}
            </CardTitle>
            <Badge
              variant={table.is_occupied ? "secondary" : "outline"}
              className={`
                font-medium
                ${table.is_occupied 
                  ? "bg-amber-100 text-amber-800 border-amber-200" 
                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
                }
              `}
            >
              {table.is_occupied ? "Occupied" : "Available"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 py-2 min-h-[60px] -mt-10">
        {table.is_occupied ? (
          <>
            {table.customer_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{table.customer_name}</span>
              </div>
            )}
            {table.customer_arrival && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(table.customer_arrival).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {getTimeElapsed(table.customer_arrival)}
                </span>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Ready for new guests
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t flex gap-2 -mt-6">
        {table.is_occupied ? (
          <>
            <Button variant="outline" size="sm" className="flex-1">
              View Orders
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1 border border-transparent transition-all hover:bg-transparent hover:text-destructive hover:border-destructive"
            >
              Checkout
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Assign Table
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}