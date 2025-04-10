'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Product not found')
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    if (id) fetchProduct()
  }, [id])

  if (loading) return <div className="text-white p-6">Loading...</div>
  if (error) return <div className="text-white p-6">{error}</div>
  if (!product) return null

  return <ProductDetailClient product={product} />
}
