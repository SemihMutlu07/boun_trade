import { notFound } from 'next/navigation';
import {supabase} from '../../lib/supabase';
import ProductDetailClient from './ProductDetailClient';
import {Metadata } from 'next';

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  return {
    title: `Product ${params.id}`,
  }
}

export default async function ProductDetailPage({params}: Props) {
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