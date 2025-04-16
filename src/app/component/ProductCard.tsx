'use client';

import Image from 'next/image';
import Link from 'next/link';
import getNameFromEmail from '../utils/emailName';
import {useState, useEffect} from 'react';
import {supabase} from '../lib/supabase';
import OfferModal from './OfferModal';

interface Product {
    id: string
    title: string
    description: string
    users_id: string
    category: string
    image_url: string
    is_traded: boolean
    users: {email :string}[]
}

export default function ProductCard({ product }: {product: Product }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({data}) => {
            setCurrentUserId(data.user?.id ||null);
        });
    }, []);

    const isOwner = currentUserId === product.users_id;

    return (
        <>
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
                Offer by: {product.users[0]?.email ? getNameFromEmail(product.users[0].email) : 'Unknown'}
                <h2 className='text-lg sm:text-xl font-semibold line-clamp-1'>{product.title}</h2>
                <p className='text-sm text-zinc-300 mt-1 line-clamp-2'>{product.description}</p>
                <span className='text-xs mt-2 inline-block bg-zinc-700 px-2 py-1 rounded self-start'>
                    {product.category}
                </span>

                <div className='flex flex-col gap-2 mt-4'>
                    <Link
                        href={`/exchange/${product.id}`}
                        className='text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-center w-full'
                    >
                        View Product            
                    </Link>

                    {!isOwner && (
                        <button
                            onClick={() => setIsOpen(true)}
                            className='text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-center w-full transition active:scale-95'
                        >
                            Send Offer
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <OfferModal
                productId={product.id}
                toUserId={product.users_id}
                onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
