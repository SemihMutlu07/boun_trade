
import { supabase } from '../../lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('id')
  return data?.map((product) => ({ id: product.id })) || []
}

interface PageProps {
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
    notFound()
  }

  return <ProductDetailClient product={product} />
}