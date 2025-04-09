"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import OfferChat from '../component/OfferChat';

interface Product {
  title: string;
  image_url: string;
}

interface Offer {
  id: string;
  message: string;
  from_user: string;
  product_id: string;
  created_at: string;
  status: string;
  product: Product[];
}

export default function MyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openChatId, setOpenChatId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOffers = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const myId = sessionData.user?.id;
      if (!myId) return;

      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          message,
          from_user,
          product_id,
          created_at,
          status,
          product:products!product_id (title, image_url)
        `)
        .eq('to_user', myId)
        .order('created_at', { ascending: false });

      if (!error && data) setOffers(data as Offer[]);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-zinc-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Incoming Offers</h1>

      {loading ? (
        <p>Loading...</p>
      ) : offers.length === 0 ? (
        <p className="text-zinc-400">You have no offers right now.</p>
      ) : (
        <ul className="space-y-4">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="bg-zinc-800 p-4 rounded border border-zinc-700"
            >
              <p className="text-sm text-zinc-300 mb-2">{offer.message}</p>

            <button
                onClick={() => 
                    setOpenChatId((prev) => (prev === offer.id ? null : offer.id))
                }
                className='mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded'
            >
                {openChatId === offer.id? 'Hide Chat' : 'Open Chat'}
            </button>

            {openChatId === offer.id && (
                <OfferChat offerId={offer.id} currentUserId={offer.from_user} />
            )}

              <div className="flex items-center gap-4 mb-3">
                <Image
                  src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${offer.product[0].image_url}`}
                  alt={offer.product[0].title}
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-white">{offer.product[0].title}</h3>
                  <p className="text-xs text-zinc-500">Product ID: {offer.product_id}</p>
                </div>
              </div>

              <p className="text-sm text-yellow-500 mb-2">Status: {offer.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
