'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import SearchInput from '../component/SearchInput'
import ProductCard from '../component/ProductCard'
import ViewTypeSelector from '../component/ViewTypeSelector'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_traded: boolean;
  users_id: string;
}

type ViewType = 'grid' | 'list' | 'masonry';

export default function ExchangePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isFetching, setIsFetching] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('grid')

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true)

      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          title, 
          description, 
          category, 
          image_url, 
          is_traded, 
          users_id, 
          users:users_id (email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products.')
        setIsFetching(false)
        setLoading(false)
        return
      }

      const transformedData = (data || []).map((item) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users : [item.users ?? { email: '' }],
      }))

      setProducts(transformedData)
      setIsFetching(false)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">Loading exchange items...</p>
      </div>
    )
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-zinc-900 navbar-safe-area text-white px-4 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Exchange Products</h1>
          <div className="flex items-center gap-4">
            <ViewTypeSelector currentView={viewType} onViewChange={setViewType} />
            <Link
              href="/add-product"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm"
            >
              + Add Item
            </Link>
          </div>
        </div>

        <SearchInput value={searchTerm} onChange={setSearchTerm} />

        <div className="mb-6 mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
          {['all', 'food', 'clothing', 'electronics'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-10 animate-fade-in">
            <p className="text-zinc-400 text-lg">No items available yet.</p>
            <Link
              href="/add-product"
              className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white shadow hover:scale-105 active:scale-95 duration-200"
            >
              Add Your First Item
            </Link>
          </div>
        ) : (
          <div className={`mt-6 ${
            viewType === 'list' 
              ? 'space-y-4' 
              : viewType === 'masonry'
              ? 'columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'
              : 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={viewType === 'masonry' ? 'break-inside-avoid' : ''}>
                <ProductCard product={product} viewType={viewType} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
