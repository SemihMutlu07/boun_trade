"use client";

import { useEffect, useState } from 'react';
import {supabase} from '../lib/supabase';
import LoginRequired from '../component/LoginRequired'


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
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchSentOffers = async() => {
            const { data: sessionData } = await supabase.auth.getUser()
            const myId = sessionData.user?.id
            
            if (!myId) {
                setLoading(false)
                return
              }      
               
            setUserId(myId)


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

    if (!offers.length && !loading) {
        return (
          <div className="min-h-screen p-6 bg-zinc-900 text-white">
            <p className="text-red-400">Please log in to view your incoming offers.</p>
          </div>
        )
      }

    if (!loading && !userId) return <LoginRequired />
      
      
    return (
        <div className='min-h-screen px-4 py-6 sm:px-6 bg-zinc-900 text-white'>
            <h1 className='text-2xl sm:text-3xl font-bold mb-6'>My Sent Offers</h1>

            {loading ? (
                <p className='text-zinc-400'>Loading...</p>
            ): offers.length === 0 ? (
                <p className='text-zinc-400'>Henüz bir teklifiniz yok.</p>
            ) : (
                <ul className='space-y-4'>
                    {offers.map((offer) => (
                        <li 
                            key={offer.id}
                            className='bg-zinc-800 p-4 sm:p-5 rounded-lg border border-zinc-700 animate-fade-in'
                        >
                            <p className='text-sm text-zinc-300 mb-2'>{offer.message}</p>

                            <div className='flex flex-col sm:flex-row sm:justify-between text-xs'> 
                                <span className='text-zinc-400'>
                                    Product ID: {offer.product_id}
                                </span>
                                <span className='text-blue-400 mt-1 sm:mt-0'>
                                    Status: {offer.status}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}