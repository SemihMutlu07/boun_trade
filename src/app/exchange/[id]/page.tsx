'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ProductDetailClient from './ProductDetailClient'

interface Product {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  is_traded: boolean
  user_id: string
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, description, category, image_url, is_traded, user_id') //including user_id
        .eq('id', params.id)
        .single()

      if (error || !data) {
        setError('Product not found')
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  if (loading) return <div className="text-white p-6">Loading...</div>
  if (error || !product) return <div className="text-white p-6">{error || 'Error'}</div>

  return <ProductDetailClient product={product} />
}
