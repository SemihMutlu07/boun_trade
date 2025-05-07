'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import OfferModal from '../../component/OfferModal';
import Link from 'next/link';
import { Calendar, MapPin, User, Clock } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_traded: boolean;
  users_id: string;
  created_at?: string;
  users?: {
    email: string;
    display_name?: string;
    department?: string;
  }[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sellerInfo, setSellerInfo] = useState<{
    display_name?: string;
    department?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });

    // Fetch seller information
    const fetchSellerInfo = async () => {
      const { data } = await supabase
        .from('users')
        .select('display_name, department, email')
        .eq('id', product.users_id)
        .single();
      
      if (data) {
        setSellerInfo(data);
      }
    };

    fetchSellerInfo();
  }, [product.users_id]);
  
  const isOwner = currentUserId === product.users_id;
  const formattedDate = product.created_at 
    ? new Date(product.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          href="/exchange"
          className="inline-flex items-center text-zinc-400 hover:text-white mb-4 sm:mb-6 transition-colors"
        >
          ← Back to Exchange
        </Link>

        <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full">
              <Image
                src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col h-full">
                {/* Main Content */}
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                    {product.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    <span className="inline-flex items-center bg-zinc-700 px-3 py-1 text-sm rounded-full">
                      {product.category}
                    </span>
                    {product.is_traded && (
                      <span className="inline-flex items-center bg-red-500/20 text-red-400 px-3 py-1 text-sm rounded-full">
                        Traded
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-300 text-base sm:text-lg mb-4 sm:mb-6">
                    {product.description}
                  </p>

                  {/* Seller Information */}
                  <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      Seller Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <User size={16} className="flex-shrink-0" />
                        <span className="truncate">{sellerInfo?.display_name || 'Anonymous'}</span>
                      </div>
                      {sellerInfo?.department && (
                        <div className="flex items-center gap-2 text-zinc-300">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span className="truncate">{sellerInfo.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Calendar size={16} className="flex-shrink-0" />
                        <span className="truncate">Listed on {formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="mt-4 sm:mt-6">
                  <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4">
                    {product.is_traded ? (
                      <div className="text-center">
                        <p className="text-red-400 font-medium mb-2">This item has been traded</p>
                        <Link
                          href="/exchange"
                          className="inline-block w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors"
                        >
                          Browse Other Items
                        </Link>
                      </div>
                    ) : isOwner ? (
                      <div className="text-center">
                        <p className="text-yellow-400 mb-2">You own this item</p>
                        <Link
                          href="/profile"
                          className="inline-block w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors"
                        >
                          View in Profile
                        </Link>
                      </div>
                    ) : currentUserId ? (
                      <div className="text-center">
                        <p className="text-zinc-300 mb-4">Interested in this item?</p>
                        <button
                          onClick={() => setIsOpen(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                          Send Offer
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-zinc-300 mb-4">Want to make an offer?</p>
                        <Link
                          href="/login"
                          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                          Log in to Send Offer
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <OfferModal
          productId={product.id}
          toUserId={product.users_id}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
