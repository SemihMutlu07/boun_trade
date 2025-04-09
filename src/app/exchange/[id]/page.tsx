import { supabase } from '../../lib/supabase'
import ProductDetailClient from './ProductDetailClient'
import { notFound } from 'next/navigation'

type PageProps = {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product || error) {
    notFound() // ✅ optional: use better error handling
  }

  return <ProductDetailClient product={product} />
}
