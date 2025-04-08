"use client";

import { useEffect, useState } from 'react';
import {supabase} from '../lib/supabase';

interface Offer {
    id: string
    message: string
    product_id: string
    to_user: string
    status: string
    created_at: string
}

export default function MySentOffersPage() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSentOffers = async() => {
            const { data: sessionData } = await supabase.auth.getUser()
            const myId = sessionData.user?.id
            if (!myId) return

            const { data, error } = await supabase
                .from('offers')
                .select('*')
                .eq('from_user', myId)
                .order('created_at', { ascending: false })
            
            if (!error && data) setOffers(data)
            setLoading(false)
        }

        fetchSentOffers()
    },[])

    return (
        <div className='min-h-screen p-6 bg-zinc-900 text-white'>
            <h1 className='text-2xl font-bold mb-6'>My Sent Offers</h1>

            {loading ? (
                <p>Loading...</p>
            ): offers.length === 0 ? (
                <p className='text-zinc-400'>Henüz bir teklifiniz yok.</p>
            ) : (
                <ul className='space-y-4'>
                    {offers.map((offer) => (
                        <li 
                            key={offer.id}
                            className='bg-zinc-800 p-4 rounded border border-zinc-700'
                        >
                            <p className='text-sm text-zinc-300 mb-2'>{offer.message}</p>
                            <span className='text-xs block text-zinc-400'>
                                Product ID: {offer.product_id}
                            </span>
                            <span className='text-xs text-blue-400 block mt-1'>
                                Status: {offer.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}