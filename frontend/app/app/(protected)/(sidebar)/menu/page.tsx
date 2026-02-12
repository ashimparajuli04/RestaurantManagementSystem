'use client'

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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

  if (isLoading) return <div>Loading menu...</div>
  if (error) return <div className="text-red-500">Failed to load menu</div>

  const { categories, subCategories, items } = data!

  return (
    <div className="min-h-screen w-full overflow-hidden bg-nj-cream">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card key={category.id} className="flex flex-col bg-nj-offwhite">
                  <CardHeader>
                    <CardTitle className="font-bold text-lg">
                      {category.name}
                    </CardTitle>
                    <Separator />
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {categorySubCategories.map((sub) => {

                      const subItems = items
                        .filter(
                          (item) =>
                            item.sub_category_id === sub.id &&
                            item.is_available
                        )
                        .slice()
                        .sort((a, b) => a.display_order - b.display_order)

                      return (
                        <Card key={sub.id} className="border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-sm">
                              {sub.name}
                            </CardTitle>
                            <Separator />
                          </CardHeader>

                          <CardContent>
                            {subItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between p-2 hover:bg-gray-50"
                              >
                                <span>{item.name}</span>
                                <Badge variant="outline">
                                  ₹{item.price}
                                </Badge>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )
                    })}

                    {categoryItemsWithNoSub.length > 0 && (
                      <Card className="border-gray-200">
                        <CardContent>
                          {categoryItemsWithNoSub.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between p-2 hover:bg-gray-50"
                            >
                              <span>{item.name}</span>
                              <Badge variant="outline">
                                ₹{item.price}
                              </Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>

      <div className="bg-black text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            All prices are inclusive of taxes
          </p>
        </div>
      </div>
    </div>
  )
}
