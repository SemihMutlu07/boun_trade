// src/app/exchange/[id]/page.tsx
import { supabase } from '../../lib/supabase'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product || error) return <div className="text-white p-6">Product not found</div>

  return <ProductDetailClient product={product} />
}
