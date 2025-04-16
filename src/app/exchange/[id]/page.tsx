import ProductDetailClient from './ProductDetailClient';
import { getProductData } from './ProductDetail.server';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductData(params.id);

  if (!product) {
    return <div className="text-white p-6">Product not found</div>;
  }

  return (
    <div className='min-h-screen bg-zinc-900 text-white px-4 py-6 sm:px-6'>
      <ProductDetailClient product={product} />
    </div>
  )
}
