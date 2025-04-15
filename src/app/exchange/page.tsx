'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import SearchInput from '../component/SearchInput'
import ProductCard from '../component/ProductCard'
import toast from 'react-hot-toast'

interface Product {
  id: string
  title: string
  description: string
  category: string
  image_url: string
}

export default function ExchangePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isFetching, setIsFetching] = useState(false)

  

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true)
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products.')
      } else {
        setProducts(data || [])
      }
      setLoading(false)
      setIsFetching(false)
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
    return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-6 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Exchange Products</h1>

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

      {loading ? (
        <p className="text-center text-zinc-300 mt-10">Loading...</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-10 animate-fade-in">
          <p className="text-zinc-400 text-lg">No items available.</p>
          <a
            href="/add-product"
            className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white shadow hover:scale-105 active:scale-95 duration-200"
          >
            Add Your First Item
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products
            .filter((product) => {
              const matchesCategory =
                selectedCategory === 'all' || product.category === selectedCategory
              const matchesSearch =
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
              return matchesCategory && matchesSearch
            })
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}
    </div>
  )
}
