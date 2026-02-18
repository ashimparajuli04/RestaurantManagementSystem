'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { OrderCard } from "@/components/tablesession/order-card"
import { Card, CardContent } from "@/components/ui/card"
import { Receipt, Coffee } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { LoadingView } from "@/components/loading"

type Order = {
  id: number
  session_id: number
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

type PaginatedResponse = {
  orders: Order[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data, isLoading, error } = useQuery<PaginatedResponse>({
    queryKey: ["orders", currentPage, pageSize],
    queryFn: async () => {
      const response = await api.get("/order", {
        params: { page: currentPage, page_size: pageSize }
      })
      return response.data
    },
    refetchInterval: 5000,
  })

  if (isLoading) {
    return (
      <LoadingView label="orders"/>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="border-2 border-stone-200">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold text-red-600 mb-2">Error loading orders</p>
            <p className="text-sm text-stone-600">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const orders = data?.orders || []
  const totalPages = data?.total_pages || 1
  const total = data?.total || 0

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Number of page buttons to show
    
    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <div className="bg-white border-b border-stone-200 rounded-2xl">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-6 w-6 text-stone-800" />
            <div className="h-1 w-12 bg-stone-800" />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            All Orders
          </h1>
          <p className="text-stone-600 text-sm">
            {total} total orders · Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Orders Grid */}
        {orders.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {orders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  sessionId={order.session_id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, idx) => (
                      <PaginationItem key={idx}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card className="border-2 border-stone-200">
            <CardContent className="py-16 text-center">
              <Receipt className="h-12 w-12 mx-auto text-stone-400 mb-4" />
              <p className="text-lg font-semibold text-stone-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                No orders found
              </p>
              <p className="text-sm text-stone-600">
                Orders will appear here once they are created
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}