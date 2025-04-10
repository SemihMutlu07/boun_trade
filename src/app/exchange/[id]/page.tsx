import { notFound } from 'next/navigation';
import {supabase} from '../../lib/supabase';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: { id: string} }) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if(!product || error ) {
    notFound()
  }

  return <ProductDetailClient product={product}/>
}