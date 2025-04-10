import { supabase } from '../../lib/supabase';
import ProductDetailClient from './ProductDetailClient';

type Params = Promise<{ id: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select('id, title, description, category, image_url, is_traded, user_id')
    .eq('id', id)
    .single();

  if (!product || error) {
    return <div className="text-white p-6">Product not found</div>;
  }

  return <ProductDetailClient product={product} />;
}
