'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import OfferModal from '../../component/OfferModal';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_traded: boolean;
  user_id: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  const isOwner = currentUserId === product.user_id;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 bg-zinc-900 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="relative w-full h-64 sm:h-80 rounded overflow-hidden mb-6">
          <Image
            src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
            alt={product.title}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{product.title}</h1>
        <p className="text-zinc-400 mb-4">{product.description}</p>
        <span className="inline-block bg-zinc-800 px-3 py-1 text-sm rounded">
          {product.category}
        </span>

        <div className="mt-6">
          {!currentUserId ? (
            <p className="text-red-400 font-medium">Please log in to send an offer.</p>
          ) : product.is_traded ? (
            <p className="text-red-400 font-medium">This product has already been traded.</p>
          ) : isOwner ? (
            <p className="text-yellow-400 text-sm">You own this item.</p>
          ) : (
            <>
              <p className="text-sm text-zinc-300 mb-2">Want to make an offer?</p>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition active:scale-95"
              >
                Send Offer
              </button>
            </>
          )}
        </div>

        {isOpen && (
          <OfferModal
            productId={product.id}
            toUserId={product.user_id}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
