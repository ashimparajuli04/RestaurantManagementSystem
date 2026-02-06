import { UtensilsCrossed } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
  sub_category_id: number
  display_order: number
  is_available: boolean
}

async function getCategories(): Promise<MenuCategory[]> {
  const res = await fetch("http://localhost:8000/menu-categories", {
    cache: "no-store",
  })
  return res.json()
}

async function getSubCategories(): Promise<MenuSubCategory[]> {
  const res = await fetch("http://localhost:8000/menu-subcategories", {
    cache: "no-store",
  })
  return res.json()
}

async function getMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("http://localhost:8000/menu-items", {
    cache: "no-store",
  })
  return res.json()
}

export default async function MenuPage() {
  const [categories, subCategories, items] = await Promise.all([
    getCategories(),
    getSubCategories(),
    getMenuItems(),
  ])

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-5 bg-nj-cream">
      {/* Header */}
      {/*<div className="bg-black text-white py-12 px-6 shadow-lg rounded-lg mx-5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <UtensilsCrossed className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-wide">Our Menu</h1>
          <p className="text-gray-400 text-sm">Explore our selection</p>
        </div>
      </div>*/}

      {/* Menu Content - 3 Column Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .sort((a, b) => a.display_order - b.display_order)
            .map((category) => {
              const categorySubCategories = subCategories
                .filter((sc) => sc.category_id === category.id)
                .sort((a, b) => a.display_order - b.display_order)
      
              const categoryItemsWithNoSub = items
                .filter(
                  (item) =>
                    item.category_id === category.id &&
                    item.sub_category_id === null &&
                    item.is_available
                )
                .sort((a, b) => a.display_order - b.display_order)
      
              return (
                <Card key={category.id} className="overflow-hidden flex flex-col bg-nj-offwhite">
                  <CardHeader className="">
                    <CardTitle className="font-giulia font-bold text-lg font-semibold text-gray-800 -mt-2">
                      {category.name}
                    </CardTitle>
                    <Separator></Separator>
                  </CardHeader>
                  
      
                  <CardContent className="space-y-4">
                    {/* Subcategories as nested cards */}
                    {categorySubCategories.map((sub) => {
                      const subItems = items
                        .filter(
                          (item) =>
                            item.sub_category_id === sub.id && item.is_available
                        )
                        .sort((a, b) => a.display_order - b.display_order)
      
                      return (
                        <Card key={sub.id} className="border-gray-200 transform transition-transform duration-100 hover:scale-101">
                          <CardHeader>
                            <CardTitle className="text-sm -mt-2">{sub.name}</CardTitle>
                            <Separator></Separator>
                          </CardHeader>
                          <CardContent className="-mt-5">
                            {subItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition"
                              >
                                <span>{item.name}</span>
                                <Badge variant="outline">₹{item.price}</Badge>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
                      )
                    })}
      
                    {/* Items without subcategory */}
                    {categoryItemsWithNoSub.length > 0 && (
                      <Card className="border-gray-200 transform transition-transform duration-100 hover:scale-101">
                        <CardContent className="-mt-5">
                          {categoryItemsWithNoSub.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition"
                            >
                              <span>{item.name}</span>
                              <Badge variant="outline">₹{item.price}</Badge>
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


      {/* Footer */}
      <div className="bg-black text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">All prices are inclusive of taxes</p>
        </div>
      </div>
    </div>
  )
}