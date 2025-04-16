'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: string
    title: string
    description: string
    category: string
    image_url: string
    is_traded: boolean
}

export default function ProductCard({ product }: {product: Product }) {
    return (
        <div className='bg-zinc-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col'>
            <div className='relative w-full h-40 sm:h-48 mb-3 rounded overflow-hidden'>
                <Image
                    src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 768px"
                />
            </div>
            <h2 className='text-lg sm:text-xl font-semibold line-clamp-1'>{product.title}</h2>
            <p className='text-sm text-zinc-300 mt-1 line-clamp-2'>{product.description}</p>
            <span className='text-xs mt-2 inline-block bg-zinc-700 px-2 py-1 rounded self-start'>
                {product.category}
            </span>
            <Link
                href={`/exchange/${product.id}`}
                className='mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-center w-full'
            >
                View Product            
            </Link>
        </div>
    )
}