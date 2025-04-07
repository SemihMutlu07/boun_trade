'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import SearchInput from '../component/SearchInput'
import ProductCard from '../component/ProductCard'

interface Product {
  id: number
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

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <SearchInput value={searchTerm} onChange={setSearchTerm}/>

    <div className='mb-6 flex flex-wrap gap-3'>
      {['all', "food", "clothing", "electronics"].map((category) => (
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

      <h1 className="text-3xl font-bold mb-6">Exchange Products</h1>

      {loading ? (
        <p>Loading...</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
          .filter((product) => {
            const matchesCategory =
              selectedCategory === "all" || product.category === selectedCategory
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
