// src/app/exchange/[id]/page.tsx

import { supabase } from '../../lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  return {
    title: `Product ${params.id}`,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
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
