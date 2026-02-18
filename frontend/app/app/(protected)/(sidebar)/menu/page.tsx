'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Coffee, Edit3, Plus, Trash2, X, Save } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingView } from "@/components/loading"

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

type CreateMenuCategoryInput = {
  name: string
}

type CreateMenuSubCategoryInput = {
  name: string
  category_id: number
}

type CreateMenuItemInput = {
  name: string
  price: number
  category_id: number
  sub_category_id: number | null
}

type CreateDialog = 
  | { type: 'category' }
  | { type: 'subcategory'; categoryId: number }
  | { type: 'item'; categoryId: number; subCategoryId: number | null }
  | null

export default function MenuPage() {
  const [editMode, setEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<MenuSubCategory | null>(null)
  const [createDialog, setCreateDialog] = useState<CreateDialog>(null)
  const [formData, setFormData] = useState({ name: '', price: '' })
  const queryClient = useQueryClient()

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

  // Category mutations
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) =>
      api.delete(`/admin/menu-categories/${categoryId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu"] }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MenuCategory> }) =>
      api.patch(`/admin/menu-categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
      setEditingCategory(null)
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateMenuCategoryInput) =>
      api.post('/admin/menu-categories/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
      setCreateDialog(null)
      setFormData({ name: '', price: '' })
    },
  })

  // SubCategory mutations
  const deleteSubCategoryMutation = useMutation({
    mutationFn: (subCategoryId: number) =>
      api.delete(`/admin/menu-subcategories/${subCategoryId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu"] }),
  })

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MenuSubCategory> }) =>
      api.patch(`/admin/menu-subcategories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
      setEditingSubCategory(null)
    },
  })

  const createSubCategoryMutation = useMutation({
    mutationFn: (data: CreateMenuSubCategoryInput) =>
      api.post('/admin/menu-subcategories/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
      setCreateDialog(null)
      setFormData({ name: '', price: '' })
    },
  })
  
  // Item mutations
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: number) => api.delete(`/admin/menu-items/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu"] }),
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MenuItem> }) =>
      api.patch(`/admin/menu-items/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
      setEditingItem(null)
    },
  })

  const createItemMutation = useMutation({
    mutationFn: (data: CreateMenuItemInput) =>
      api.post('/admin/menu-items/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] })
      setCreateDialog(null)
      setFormData({ name: '', price: '' })
    },
  })

  if (isLoading) {
    return (
      <LoadingView label="menu"/>
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

  const handleCreateSubmit = () => {
    if (!createDialog) return

    if (createDialog.type === 'category') {
      createCategoryMutation.mutate({ name: formData.name })
    } else if (createDialog.type === 'subcategory') {
      createSubCategoryMutation.mutate({
        name: formData.name,
        category_id: createDialog.categoryId,
      })
    } else if (createDialog.type === 'item') {
      createItemMutation.mutate({
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: createDialog.categoryId,
        sub_category_id: createDialog.subCategoryId,
      })
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Create Dialog */}
      <Dialog 
        open={createDialog !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialog(null)
            setFormData({ name: '', price: '' })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createDialog?.type === 'category' && 'Add Category'}
              {createDialog?.type === 'subcategory' && 'Add Subcategory'}
              {createDialog?.type === 'item' && 'Add Menu Item'}
            </DialogTitle>
            <DialogDescription>
              {createDialog?.type === 'category' && 'Create a new menu category'}
              {createDialog?.type === 'subcategory' && 'Create a new subcategory'}
              {createDialog?.type === 'item' && 'Add a new item to the menu'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={
                  createDialog?.type === 'category' ? 'e.g., Beverages' :
                  createDialog?.type === 'subcategory' ? 'e.g., Hot Drinks' :
                  'e.g., Cappuccino'
                }
                autoFocus
              />
            </div>
            {createDialog?.type === 'item' && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 150"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialog(null)
                setFormData({ name: '', price: '' })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={
                !formData.name ||
                (createDialog?.type === 'item' && !formData.price)
              }
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mode Toggle Button */}
      <button
        onClick={() => setEditMode(!editMode)}
        className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all ${
          editMode
            ? 'bg-stone-800 text-white hover:bg-stone-700'
            : 'bg-white text-stone-800 hover:bg-stone-50 border border-stone-300'
        }`}
      >
        {editMode ? (
          <>
            <X className="h-4 w-4" />
            Exit Edit Mode
          </>
        ) : (
          <>
            <Edit3 className="h-4 w-4" />
            Edit Menu
          </>
        )}
      </button>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 rounded-b-2xl">
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
        {editMode && (
          <button
            onClick={() => setCreateDialog({ type: 'category' })}
            className="mb-8 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}

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
                  <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-stone-300">
                    {editingCategory?.id === category.id ? (
                      <Input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        className="text-2xl font-bold text-stone-900 border-b-2 border-stone-400 outline-none"
                        style={{ fontFamily: 'Georgia, serif' }}
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
                        {category.name}
                      </h2>
                    )}
                    
                    {editMode && (
                      <div className="flex items-center gap-2">
                        {editingCategory?.id === category.id ? (
                          <button
                            onClick={() =>
                              updateCategoryMutation.mutate({
                                id: category.id,
                                data: { name: editingCategory.name },
                              })
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 text-stone-600 hover:bg-stone-100 rounded"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setCreateDialog({ type: 'subcategory', categoryId: category.id })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Add Subcategory"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this category?')) {
                              deleteCategoryMutation.mutate(category.id)
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

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

                      if (subItems.length === 0 && !editMode) return null

                      return (
                        <div key={sub.id}>
                          <div className="flex items-center justify-between mb-4">
                            {editingSubCategory?.id === sub.id ? (
                              <Input
                                type="text"
                                value={editingSubCategory.name}
                                onChange={(e) =>
                                  setEditingSubCategory({ ...editingSubCategory, name: e.target.value })
                                }
                                className="text-sm font-semibold text-stone-600 uppercase tracking-wider border-b border-stone-400 outline-none"
                              />
                            ) : (
                              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wider pl-1">
                                {sub.name}
                              </h3>
                            )}
                            
                            {editMode && (
                              <div className="flex items-center gap-2">
                                {editingSubCategory?.id === sub.id ? (
                                  <button
                                    onClick={() =>
                                      updateSubCategoryMutation.mutate({
                                        id: sub.id,
                                        data: { name: editingSubCategory.name },
                                      })
                                    }
                                    className="p-1 text-green-600 hover:bg-green-50 rounded text-xs"
                                  >
                                    <Save className="h-3 w-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setEditingSubCategory(sub)}
                                    className="p-1 text-stone-600 hover:bg-stone-100 rounded text-xs"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => setCreateDialog({ type: 'item', categoryId: category.id, subCategoryId: sub.id })}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded text-xs"
                                  title="Add Item"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this subcategory?')) {
                                      deleteSubCategoryMutation.mutate(sub.id)
                                    }
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded text-xs"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            {subItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-baseline gap-4 group hover:bg-white px-3 py-2 rounded transition-colors"
                              >
                                <div className="flex-1 flex items-baseline gap-2">
                                  {editingItem?.id === item.id ? (
                                    <Input
                                      type="text"
                                      value={editingItem.name}
                                      onChange={(e) =>
                                        setEditingItem({ ...editingItem, name: e.target.value })
                                      }
                                      className="text-stone-900 font-medium border-b border-stone-400 outline-none"
                                    />
                                  ) : (
                                    <span className="text-stone-900 font-medium group-hover:text-stone-700 transition-colors">
                                      {item.name}
                                    </span>
                                  )}
                                  <div className="flex-1 border-b border-dotted border-stone-300 mb-1" />
                                </div>
                                {editingItem?.id === item.id ? (
                                  <Input
                                    type="number"
                                    value={editingItem.price}
                                    onChange={(e) =>
                                      setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })
                                    }
                                    className="text-stone-700 font-medium w-24 border-b border-stone-400 outline-none text-right"
                                  />
                                ) : (
                                  <span className="text-stone-700 font-medium whitespace-nowrap">
                                    Rs. {item.price}
                                  </span>
                                )}
                                {editMode && (
                                  <div className="flex items-center gap-1 ml-2">
                                    {editingItem?.id === item.id ? (
                                      <button
                                        onClick={() =>
                                          updateItemMutation.mutate({
                                            id: item.id,
                                            data: {
                                              name: editingItem.name,
                                              price: editingItem.price,
                                            },
                                          })
                                        }
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                      >
                                        <Save className="h-3 w-3" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setEditingItem(item)}
                                        className="p-1 text-stone-600 hover:bg-stone-100 rounded"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (confirm('Delete this item?')) {
                                          deleteItemMutation.mutate(item.id)
                                        }
                                      }}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                            {editMode && subItems.length === 0 && (
                              <p className="text-stone-400 text-sm italic pl-3">No items yet</p>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {/* Items without subcategory */}
                    {(categoryItemsWithNoSub.length > 0 || editMode) && (
                      <div className="space-y-3">
                        {editMode && categorySubCategories.length > 0 && (
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wider pl-1">
                              General Items
                            </h3>
                            <button
                              onClick={() => setCreateDialog({ type: 'item', categoryId: category.id, subCategoryId: null })}
                              className="p-1 text-green-600 hover:bg-green-50 rounded text-xs"
                              title="Add Item"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        {editMode && categorySubCategories.length === 0 && (
                          <button
                            onClick={() => setCreateDialog({ type: 'item', categoryId: category.id, subCategoryId: null })}
                            className="mb-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add Item
                          </button>
                        )}
                        {categoryItemsWithNoSub.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-baseline gap-4 group hover:bg-white px-3 py-2 rounded transition-colors"
                          >
                            <div className="flex-1 flex items-baseline gap-2">
                              {editingItem?.id === item.id ? (
                                <Input
                                  type="text"
                                  value={editingItem.name}
                                  onChange={(e) =>
                                    setEditingItem({ ...editingItem, name: e.target.value })
                                  }
                                  className="text-stone-900 font-medium border-b border-stone-400 outline-none"
                                />
                              ) : (
                                <span className="text-stone-900 font-medium group-hover:text-stone-700 transition-colors">
                                  {item.name}
                                </span>
                              )}
                              <div className="flex-1 border-b border-dotted border-stone-300 mb-1" />
                            </div>
                            {editingItem?.id === item.id ? (
                              <Input
                                type="number"
                                value={editingItem.price}
                                onChange={(e) =>
                                  setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })
                                }
                                className="text-stone-700 font-medium w-24 border-b border-stone-400 outline-none text-right"
                              />
                            ) : (
                              <span className="text-stone-700 font-medium whitespace-nowrap">
                                Rs. {item.price}
                              </span>
                            )}
                            {editMode && (
                              <div className="flex items-center gap-1 ml-2">
                                {editingItem?.id === item.id ? (
                                  <button
                                    onClick={() =>
                                      updateItemMutation.mutate({
                                        id: item.id,
                                        data: {
                                          name: editingItem.name,
                                          price: editingItem.price,
                                        },
                                      })
                                    }
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  >
                                    <Save className="h-3 w-3" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setEditingItem(item)}
                                    className="p-1 text-stone-600 hover:bg-stone-100 rounded"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this item?')) {
                                      deleteItemMutation.mutate(item.id)
                                    }
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
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