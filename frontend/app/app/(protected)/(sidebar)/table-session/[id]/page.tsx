'use client'
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Clock, 
  Receipt, 
  Plus, 
  Trash2,
  DollarSign,
  UtensilsCrossed 
} from "lucide-react"

type OrderItem = {
  id: number
  menu_item_id: number
  quantity: number
  price_at_time: number
  note: string
  line_total: number
}

type Order = {
  id: number
  items: OrderItem[]
  total_amount: number
  created_at: string
  status: string
  served_at: string | null
}

type Session = {
  id: number
  table_id: number
  customer_name: string | null
  total_bill: number
  orders: Order[]
}

export default function TableSessionPage() {
  const params = useParams()
  const sessionId = params.id
  const queryClient = useQueryClient()
  const [customerName, setCustomerName] = useState("")

  // Fetch table session
  const { data: session, isLoading } = useQuery<Session>({
    queryKey: ["tableSession", sessionId],
    queryFn: async () => {
      const res = await api.get(`/table-sessions/${sessionId}`)
      return res.data
    },
  })

  // Fetch menu items to display names
  const { data: menuItems } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const res = await api.get("/menu-items")
      return res.data
    },
  })

  // Set customer name when session loads
  useEffect(() => {
    if (session?.customer_name) {
      setCustomerName(session.customer_name)
    }
  }, [session])

  // Patch customer name
  const updateCustomerMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.patch(`/table-sessions/${sessionId}`, {
        customer_name: name,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableSession", sessionId] })
    },
  })

  // Create empty order
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/table-sessions/${sessionId}/orders`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableSession", sessionId] })
    },
  })
  
  const deleteOrderMutation = useMutation({
    mutationFn: async (order_id: number) => {
      const res = await api.delete(`/order/${order_id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableSession", sessionId] })
    },
  })

  // Add item to order
  const addItemMutation = useMutation({
    mutationFn: async ({ 
      orderId, 
      menuItemId, 
      quantity, 
      note 
    }: { 
      orderId: number
      menuItemId: number
      quantity: number
      note: string 
    }) => {
      const res = await api.post(`/order/${orderId}/items`, {
        menu_item_id: menuItemId,
        quantity: quantity,
        note: note,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableSession", sessionId] })
    },
  })

  const getMenuItemName = (itemId: number) => {
    const item = menuItems?.find((m: any) => m.id === itemId)
    return item?.name || `Item #${itemId}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "served":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading session...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <UtensilsCrossed className="h-8 w-8 text-primary" />
                  Table {session?.table_id}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Session #{sessionId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Bill</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{session?.total_bill.toFixed(2)}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="customer-name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Customer Name
                </Label>
                <Input
                  id="customer-name"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <Button
                onClick={() => updateCustomerMutation.mutate(customerName)}
                disabled={updateCustomerMutation.isPending}
              >
                {updateCustomerMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              Orders ({session?.orders?.length || 0})
            </h3>
            <Button 
              className="flex items-center gap-2"
              onClick={() => createOrderMutation.mutate()}
              disabled={createOrderMutation.isPending}
            >
              <Plus className="h-4 w-4" />
              {createOrderMutation.isPending ? "Creating..." : "New Order"}
            </Button>
          </div>

          {session?.orders && session.orders.length > 0 ? (
            <div className="grid gap-4">
              {session.orders.map((order, index) => (
                <Card key={order.id}>
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
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
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
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">
                                {getMenuItemName(item.menu_item_id)}
                              </p>
                              {item.note && (
                                <p className="text-sm text-muted-foreground italic">
                                  Note: {item.note}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Qty:</span>{" "}
                                <span className="font-medium">{item.quantity}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">@</span>{" "}
                                <span className="font-medium">₹{item.price_at_time}</span>
                              </div>
                              <div className="text-right min-w-[8px]">
                                <p className="font-bold">₹{item.line_total}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No items in this order
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Open modal to add items
                        // For now, adding a test item
                        addItemMutation.mutate({
                          orderId: order.id,
                          menuItemId: 80,
                          quantity: 1,
                          note: "Test item"
                        })
                      }}
                      disabled={addItemMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {addItemMutation.isPending ? "Adding..." : "Add Item"}
                    </Button>
                    <Button variant="destructive"
                      size="sm"
                      onClick={() => deleteOrderMutation.mutate(order.id)}
                      disabled={deleteOrderMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Order
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No orders yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by creating the first order for this table
                </p>
                <Button 
                  className="flex items-center gap-2 mx-auto"
                  onClick={() => createOrderMutation.mutate()}
                  disabled={createOrderMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                  {createOrderMutation.isPending ? "Creating..." : "Create First Order"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3 justify-end">
              <Button variant="outline">
                Close Session
              </Button>
              <Button className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Checkout & Print Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}