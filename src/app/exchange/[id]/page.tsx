import { supabase } from '../../lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import type { Metadata } from 'next'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Product ${params.id}`,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { data: product, error } = await supabase
    .from('products')
    .select('id, title, description, category, image_url, is_traded, user_id')
    .eq('id', params.id)
    .single()

  if (!product || error) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
