import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Plus, Trash2, CheckCircle, ChefHat, ExternalLink } from "lucide-react"
import { ItemModal } from "./item-modal"

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

type MenuItem = {
  id: number
  name: string
  price: number
  category_id: number
  sub_category_id: number | null
  display_order: number
  is_available: boolean
}

type MenuCategory = {
  id: number
  name: string
  display_order: number
}

type MenuSubCategory = {
  id: number
  name: string
  category_id: number
  display_order: number
}

type AddItemParams = {
  orderId: number
  menuItemId: number
  quantity: number
  note: string
}

export function OrderCard({ 
  order,
  sessionId
}: { 
  order: Order
  sessionId?: number
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tableSession"] })

  // Fetch menu data
  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
    queryFn: async () => (await api.get("/menu-items")).data,
  })

  const { data: categories } = useQuery<MenuCategory[]>({
    queryKey: ["menu-categories"],
    queryFn: async () => (await api.get("/menu-categories")).data,
  })
  
  const { data: subCategories } = useQuery<MenuSubCategory[]>({
    queryKey: ["menu-subcategories"],
    queryFn: async () => (await api.get("/menu-subcategories")).data,
  })

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: ({ orderId, menuItemId, quantity, note }: AddItemParams) => 
      api.post(`/order/${orderId}/items`, { menu_item_id: menuItemId, quantity, note }),
    onSuccess: invalidate,
  })

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: () => api.delete(`/order/${order.id}`),
    onSuccess: invalidate,
  })

  // Toggle order status mutation
  const toggleOrderStatusMutation = useMutation({
    mutationFn: () => api.patch(`/order/${order.id}/toggle-status`),
    onSuccess: invalidate,
  })

  const isPending = order.status === "pending"
  const isServed = order.status === "served"

  const getMenuItemName = (id: number): string => {
    return menuItems?.find((m) => m.id === id)?.name || `Item #${id}`
  }

  const handleAddItems = async (items: Record<number, number>) => {
    const itemsToAdd = Object.entries(items).filter(([_, qty]) => qty > 0)
    
    try {
      for (const [menuId, qty] of itemsToAdd) {
        await addItemMutation.mutateAsync({
          orderId: order.id,
          menuItemId: Number(menuId),
          quantity: qty,
          note: ""
        })
      }
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add items:', error)
    }
  }

  const formatServedTime = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const nepalTime = new Date(date.getTime() + (5 * 60 + 45) * 60 * 1000)
    let hours = nepalTime.getUTCHours()
    const minutes = String(nepalTime.getUTCMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return `${hours}:${minutes} ${ampm}`
  }

  return (
    <>
      <Card className={`flex flex-col ${isServed ? "border-green-200 bg-green-50/30" : ""}`}>
            <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                Order #{order.id}
                {isPending && <ChefHat className="h-4 w-4 text-orange-500" />}
                {isServed && <CheckCircle className="h-4 w-4 text-green-600" />}
                {sessionId && (
                  <Button
                    size="sm"
                    variant="outline"  // Changed from "ghost"
                    onClick={() => router.push(`/table-session/${sessionId}`)}
                    className="h-7 px-3 text-xs ml-2"  // Made slightly bigger
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Table #{sessionId}
                  </Button>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(order.created_at).toLocaleString()}
              </div>
              {isServed && order.served_at && (
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Served at {formatServedTime(order.served_at)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant={isPending ? "outline" : "default"}
                onClick={() => toggleOrderStatusMutation.mutate()}
                disabled={toggleOrderStatusMutation.isPending}
                className={isPending 
                  ? "border-orange-300 text-orange-700 hover:bg-orange-50" 
                  : "bg-green-600 hover:bg-green-700 text-white"
                }
              >
                {isPending ? (
                  <>
                    <ChefHat className="h-4 w-4 mr-1" />
                    Mark Served
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Served
                  </>
                )}
              </Button>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">₹{order.total_amount}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {order.items && order.items.length > 0 ? (
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddModalOpen(true)}
            disabled={isServed}
          >
            <Plus className="h-4 w-4 mr-2" />Add Item
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => deleteOrderMutation.mutate()}
            disabled={deleteOrderMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />Delete
          </Button>
        </CardFooter>
      </Card>

      <ItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        orderId={order.id}
        menuItems={menuItems || []}
        categories={categories || []}
        subCategories={subCategories || []}
        onAdd={handleAddItems}
        isLoading={addItemMutation.isPending}
      />
    </>
  )
}