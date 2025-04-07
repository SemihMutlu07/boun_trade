'use client';

import Image from 'next/image';

interface Product {
    id: number
    title: string
    description: string
    category: string
    image_url: string
}

export default function ProductCard({ product }: {product: Product }) {
    return (
        <div className='bg-zinc-800 p-4 rounded-lg shadow'>
            <div className='relative w-full h-48 mb-2 rounded overflow-hidden'>
                <Image
                    src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <h2 className='text-xl font-semibold'>{product.title}</h2>
            <p className='text-sm text-zinc-300'>{product.description}</p>
            <span className='text-xs mt-1 inline-block bg-zinc-700 px-2 py-1 rounded'>
                {product.category}
            </span>
            <button
                onClick={() => console.log("Send offer for product", product.id)}
                className='mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded'
            >
                Send Offer
            </button>
        </div>
    )
}