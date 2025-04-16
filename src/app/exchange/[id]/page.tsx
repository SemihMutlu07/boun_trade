import { supabase } from '../../lib/supabase';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: {id:string};
}

export default async function ProductDetailPage({params }: PageProps){
  const { id } = params;
  

  const { data: product, error } = await supabase
    .from('products')
    .select('id, title, description, category, image_url, is_traded, users_id')
    .eq('id', id)
    .single();

  if (!product || error) {
    return <div className="text-white p-6">Product not found</div>;
  }

  return (
    <div className='min-h-screen bg-zinc-900 text-white px-4 py-6 sm:px-6'>
      <ProductDetailClient product={product} />
    </div>
  )
}
