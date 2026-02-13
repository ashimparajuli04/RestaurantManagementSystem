'use client'
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Receipt, Plus, DollarSign, UtensilsCrossed } from "lucide-react"
import { ItemModal } from "@/components/tablesession/item-modal"
import { OrderCard } from "@/components/tablesession/order-card"

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

type TableSession = {
  id: number
  table_id: number
  customer_name: string | null
  total_bill: number
  orders: Order[]
  started_at: string
  ended_at: string
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

export default function TableSessionPage() {
  const router = useRouter()
  const { id: sessionId } = useParams()
  const queryClient = useQueryClient()
  const [customerName, setCustomerName] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isAddingItems, setIsAddingItems] = useState(false)
  
  const handleAddItems = async (items: Record<number, number>) => {
    if (!selectedOrderId) return
    
    setIsAddingItems(true)
    
    try {
      const itemsToAdd = Object.entries(items).filter(([_, qty]) => qty > 0)
      
      for (const [menuId, qty] of itemsToAdd) {
        await addItemMutation.mutateAsync({
          orderId: selectedOrderId,
          menuItemId: Number(menuId),
          quantity: qty,
          note: ""
        })
      }
      
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add items:', error)
    } finally {
      setIsAddingItems(false)
    }
  }

  const { data: session, isLoading } = useQuery<TableSession>({
    queryKey: ["tableSession", sessionId],
    queryFn: async () => (await api.get(`/table-sessions/${sessionId}`)).data,
  })

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

  useEffect(() => {
    if (session?.customer_name) setCustomerName(session.customer_name)
  }, [session])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tableSession", sessionId] })

  const updateCustomerMutation = useMutation({
    mutationFn: (name: string) => api.patch(`/table-sessions/${sessionId}`, { customer_name: name }),
    onSuccess: invalidate,
  })

  const createOrderMutation = useMutation({
    mutationFn: () => api.post(`/table-sessions/${sessionId}/orders`),
    onSuccess: invalidate,
  })

  const deleteOrderMutation = useMutation({
    mutationFn: (order_id: number) => api.delete(`/order/${order_id}`),
    onSuccess: invalidate,
  })

  const addItemMutation = useMutation({
    mutationFn: ({ orderId, menuItemId, quantity, note }: AddItemParams) => 
      api.post(`/order/${orderId}/items`, { menu_item_id: menuItemId, quantity, note }),
    onSuccess: invalidate,
  })

  const closeSessionMutation = useMutation({
    mutationFn: () => api.post(`/table-sessions/${sessionId}/close`),
    onSuccess: invalidate,
  })

  const getMenuItemName = (id: number): string => {
    return menuItems?.find((m) => m.id === id)?.name || `Item #${id}`
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
        
        {/* Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <UtensilsCrossed className="h-8 w-8 text-primary" />
                  Table {session?.table_id}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Session #{sessionId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Bill</p>
                <p className="text-3xl font-bold text-primary">₹{session?.total_bill.toFixed(2)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                updateCustomerMutation.mutate(customerName)
              }}
              className="flex gap-3 items-end"
            >
              <div className="flex-1">
                <Label htmlFor="customer-name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />Customer Name
                </Label>
                <Input 
                  id="customer-name" 
                  placeholder="Enter customer name" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                />
              </div>
              <Button 
                type="submit"
                disabled={updateCustomerMutation.isPending}
              >
                {updateCustomerMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6" />Orders ({session?.orders?.length || 0})
            </h3>
            <Button 
              onClick={() => createOrderMutation.mutate()} 
              disabled={createOrderMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              {createOrderMutation.isPending ? "Creating..." : "New Order"}
            </Button>
          </div>

          {session?.orders?.length ? (
            session.orders.map((order, i) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                index={i} 
                getMenuItemName={getMenuItemName}
                onAddItem={(id) => { 
                  setSelectedOrderId(id)
                  setIsAddModalOpen(true) 
                }}
                onDelete={(id) => deleteOrderMutation.mutate(id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No orders yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by creating the first order for this table
                </p>
                <Button 
                  onClick={() => createOrderMutation.mutate()} 
                  disabled={createOrderMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createOrderMutation.isPending ? "Creating..." : "Create First Order"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3 justify-end">
              {!session.ended_at && (
                <Button
                  variant="outline"
                  onClick={() => closeSessionMutation.mutate()}
                  disabled={closeSessionMutation.isPending}
                >
                  {closeSessionMutation.isPending ? "Please wait..." : "Free Table"}
                </Button>
              )}

              <Button 
                onClick={() => router.push(`/checkout/${sessionId}`)}
                className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <DollarSign className="h-4 w-4" />
                Print Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        orderId={selectedOrderId}
        menuItems={menuItems || []}
        categories={categories || []}
        subCategories={subCategories || []}
        onAdd={handleAddItems}
        isLoading={isAddingItems}
      />
    </div>
  )
}