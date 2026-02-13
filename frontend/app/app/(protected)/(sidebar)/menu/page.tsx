'use client'

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Coffee } from "lucide-react"

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

type MenuItem = {
  id: number
  name: string
  price: number
  category_id: number
  sub_category_id: number | null
  display_order: number
  is_available: boolean
}

export default function MenuPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const [catRes, subRes, itemRes] = await Promise.all([
        api.get<MenuCategory[]>("/menu-categories"),
        api.get<MenuSubCategory[]>("/menu-subcategories"),
        api.get<MenuItem[]>("/menu-items"),
      ])

      return {
        categories: catRes.data,
        subCategories: subRes.data,
        items: itemRes.data,
      }
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Coffee className="h-10 w-10 mx-auto text-stone-800 animate-pulse" />
          <p className="text-stone-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-red-600">Failed to load menu</div>
      </div>
    )
  }

  const { categories, subCategories, items } = data!

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 rounded-b-4xl">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Coffee className="h-8 w-8 text-stone-800" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-2 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            NJ&apos;S Café & Restaurant
          </h1>
          <div className="w-16 h-0.5 bg-stone-800 mx-auto" />
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-16">
          {categories
            .slice()
            .sort((a, b) => a.display_order - b.display_order)
            .map((category) => {
              const categorySubCategories = subCategories
                .filter((sc) => sc.category_id === category.id)
                .slice()
                .sort((a, b) => a.display_order - b.display_order)

              const categoryItemsWithNoSub = items
                .filter(
                  (item) =>
                    item.category_id === category.id &&
                    item.sub_category_id === null &&
                    item.is_available
                )
                .slice()
                .sort((a, b) => a.display_order - b.display_order)

              return (
                <div key={category.id}>
                  {/* Category Title */}
                  <h2 className="text-2xl font-bold text-stone-900 mb-6 pb-3 border-b-2 border-stone-300" style={{ fontFamily: 'Georgia, serif' }}>
                    {category.name}
                  </h2>

                  <div className="space-y-8">
                    {/* Subcategories */}
                    {categorySubCategories.map((sub) => {
                      const subItems = items
                        .filter(
                          (item) =>
                            item.sub_category_id === sub.id &&
                            item.is_available
                        )
                        .slice()
                        .sort((a, b) => a.display_order - b.display_order)

                      if (subItems.length === 0) return null

                      return (
                        <div key={sub.id}>
                          <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-4 pl-1">
                            {sub.name}
                          </h3>
                          <div className="space-y-3">
                            {subItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-baseline gap-4 group hover:bg-white px-3 py-2 rounded transition-colors"
                              >
                                <div className="flex-1 flex items-baseline gap-2">
                                  <span className="text-stone-900 font-medium group-hover:text-stone-700 transition-colors">
                                    {item.name}
                                  </span>
                                  <div className="flex-1 border-b border-dotted border-stone-300 mb-1" />
                                </div>
                                <span className="text-stone-700 font-medium whitespace-nowrap">
                                  Rs. {item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    {/* Items without subcategory */}
                    {categoryItemsWithNoSub.length > 0 && (
                      <div className="space-y-3">
                        {categoryItemsWithNoSub.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-baseline gap-4 group hover:bg-white px-3 py-2 rounded transition-colors"
                          >
                            <div className="flex-1 flex items-baseline gap-2">
                              <span className="text-stone-900 font-medium group-hover:text-stone-700 transition-colors">
                                {item.name}
                              </span>
                              <div className="flex-1 border-b border-dotted border-stone-300 mb-1" />
                            </div>
                            <span className="text-stone-700 font-medium whitespace-nowrap">
                              Rs. {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-stone-200 bg-white py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="text-sm text-stone-500">
            All prices are inclusive of taxes
          </p>
        </div>
      </div>
    </div>
  )
}