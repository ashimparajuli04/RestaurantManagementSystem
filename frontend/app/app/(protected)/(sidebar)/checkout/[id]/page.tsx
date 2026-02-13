'use client'
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Printer, CheckCircle2 } from "lucide-react"

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

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: session, isLoading } = useQuery<TableSession>({
    queryKey: ["tableSession", sessionId],
    queryFn: async () => (await api.get(`/table-sessions/${sessionId}`)).data,
  })

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
    queryFn: async () => (await api.get("/menu-items")).data,
  })

  const closeSessionMutation = useMutation({
    mutationFn: () => api.post(`/table-sessions/${sessionId}/close`),
    onSuccess: () => {
      router.push('/dashboard')
    },
  })

  const getMenuItemName = (id: number): string => 
    menuItems?.find((m) => m.id === id)?.name || `Item #${id}`

  const handlePrint = () => {
    window.print()
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      await closeSessionMutation.mutateAsync()
    } catch (error) {
      console.error('Failed to close session:', error)
      setIsProcessing(false)
    }
  }
  


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading bill...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Session not found</div>
      </div>
    )
  }

  const allItems = session.orders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      name: getMenuItemName(item.menu_item_id)
    }))
  )

  // Group items by menu_item_id and sum quantities
  const consolidatedItems = allItems.reduce((acc, item) => {
    const existing = acc.find(i => i.menu_item_id === item.menu_item_id)
    if (existing) {
      existing.quantity += item.quantity
      existing.line_total += item.line_total
    } else {
      acc.push({ ...item })
    }
    return acc
  }, [] as typeof allItems)

  const total = session.total_bill
  const displayDate = new Date(session.ended_at ?? new Date())


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          @page {
            margin: 0.5cm;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className="max-w-md mx-auto p-4">
        {/* Back Button - No Print */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4 no-print"
          size="sm"
        >
          ← Back
        </Button>

        {/* Receipt */}
        <div className="bg-white border-2 border-gray-300 font-mono text-sm">
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-gray-400 p-4 pb-3">
            <h1 className="text-xl font-bold tracking-wider mb-1">NJ&apos;S CAFÉ AND RESTAURANT</h1>
            <p className="text-xs text-gray-600">TAX INVOICE</p>
          </div>

          {/* Info */}
          <div className="px-4 py-3 text-xs border-b border-dashed border-gray-400">
            <div className="flex justify-between mb-1">
              <span>Date:</span>
              <span className="font-semibold">{displayDate.toLocaleString("en-NP", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  timeZone: "Asia/Kathmandu",
                })}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Time:</span>
              <span className="font-semibold">{displayDate.toLocaleString("en-NP", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Kathmandu",
                })}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Table:</span>
              <span className="font-semibold">#{session.table_id}</span>
            </div>
            {session.customer_name && (
              <div className="flex justify-between">
                <span>Guest:</span>
                <span className="font-semibold">{session.customer_name}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="px-4 py-3 border-b-2 border-dashed border-gray-400">
            <div className="flex justify-between text-xs font-bold mb-2 pb-1 border-b border-gray-300">
              <span>ITEM</span>
              <span>QTY</span>
              <span>PRICE</span>
              <span>AMOUNT</span>
            </div>
            {consolidatedItems.map((item, index) => (
              <div key={`${item.menu_item_id}-${index}`} className="mb-3">
                <div className="flex justify-between items-start text-xs">
                  <span className="flex-1 pr-2 leading-tight">{item.name}</span>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <span className="w-12 text-right">{item.price_at_time}</span>
                  <span className="w-16 text-right font-semibold">{item.line_total.toFixed(2)}</span>
                </div>
                {item.note && (
                  <div className="text-[10px] text-gray-500 italic ml-1 mt-0.5">
                    * {item.note}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-4 py-3 text-xs">
            <div className="flex justify-between text-base font-bold">
              <span>TOTAL:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-dashed border-gray-400 px-4 py-3 text-center text-xs space-y-1">
            <p className="font-semibold">THANK YOU FOR VISITING!</p>
            <p className="text-[10px] text-gray-600">All prices inclusive of taxes</p>
            <p className="text-[10px] text-gray-500 print-only mt-2">*** CUSTOMER COPY ***</p>
          </div>
        </div>

        {/* Action Buttons - No Print */}
        <div className="mt-4 flex gap-2 no-print">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {!session.ended_at && (<Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Free Table
              </>
            )}
          </Button>)}
        </div>
      </div>
    </div>
  )
}