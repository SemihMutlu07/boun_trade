'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Image from 'next/image'

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
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-800 p-4 rounded-lg shadow">
              <div className="relative w-full h-48 mb-2 rounded overflow-hidden">
                <Image
                  src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-sm text-zinc-300">{product.description}</p>
              <span className="text-xs mt-1 inline-block bg-zinc-700 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
