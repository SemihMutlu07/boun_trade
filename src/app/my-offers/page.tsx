"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Offer {
    id: string
    message: string
    from_user: string
    product_id: string
    created_at: string
}

export default function MyOffersPage() {
   const [offers, setOffers] = useState<Offer[]>([])
   const [loading, setLoading] = useState(true)
   
   const handleUpdateOffer = async (offerId: string, status: string) => {
    const { error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId)
  
    if (!error) {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status } : offer
        )
      )
    }
  }
  

   useEffect(() => {
    const fetchOffers = async () => {
        const {data: sessionData} = await supabase.auth.getUser()
        const myId = sessionData.user?.id
        if (!myId) return

        const { data, error } = await supabase
            .from('offers')
            .select("*")
            .eq('to_user', myId)
            .order('created_at', { ascending: false })

        if (!error && data) setOffers(data)
        setLoading(false)
    }
    fetchOffers()
    
   }, [])

   return (
    <div className='min-h-screen p-6 bg-zinc-900 text-white'>
        <h1 className='text-2xl font-bold mb-6'>Incoming Offers</h1>

        {loading ? (
            <p>loading...</p>
        ) : offers.length === 0 ? (
            <p className='text-zinc-400'>You have no offers right now.</p>
        ) : (
            <ul className='space-y-4'>
                {offers.map((offer) => (
                    <li
                        key={offer.id}
                        className='bg-zinc-800 p-4 rounded border border-zinc-700'
                    >
                        <p className='text-sm text-zinc-300 mb-2'>{offer.message}</p>
                        <span className='text-xs text-zinc-500 block mb-3'>
                            Product ID: {offer.product_id}
                        </span>
                        
                        <div className='flex gap-4'>

                            <button
                                onClick={() => handleUpdateOffer(offer.id, "accepted")}
                                className='px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-sm'
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleUpdateOffer(offer.id, "rejected")}
                                className='px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm'
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
   )
}