import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "../ui/badge"
import { Clock, Plus, Trash2, Pencil } from "lucide-react"

type Order = {
  id: number
  items: OrderItem[]
  total_amount: number
  created_at: string
  status: string
  served_at: string | null
}

type OrderItem = {
  id: number
  menu_item_id: number
  quantity: number
  price_at_time: number
  note: string
  line_total: number
}

export function OrderCard({ 
  order, 
  index, 
  getMenuItemName, 
  onAddItem, 
  onDelete 
}: { 
  order: Order
  index: number
  getMenuItemName: (id: number) => string
  onAddItem: (orderId: number) => void
  onDelete: (orderId: number) => void
}) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      served: "bg-green-100 text-green-800 border-green-200",
      default: "bg-gray-100 text-gray-800 border-gray-200"
    }
    return colors[status as keyof typeof colors] || colors.default
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Order #{index + 1}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">₹{order.total_amount}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {order.items.length > 0 ? (
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{getMenuItemName(item.menu_item_id)}</p>
                  {item.note && <p className="text-sm text-muted-foreground italic">Note: {item.note}</p>}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm"><span className="text-muted-foreground">Qty:</span> {item.quantity}</span>
                  <span className="text-sm"><span className="text-muted-foreground">@</span> ₹{item.price_at_time}</span>
                  <p className="font-bold min-w-20 text-right">₹{item.line_total}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No items in this order</p>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onAddItem(order.id)}>
          <Plus className="h-4 w-4 mr-2" />Add Item
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" />Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(order.id)}>
            <Trash2 className="h-4 w-4 mr-2" />Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}