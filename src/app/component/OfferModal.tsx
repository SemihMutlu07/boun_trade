"use client";

import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; 

interface OfferModalProps {
    productId: string
    toUserId: string
    onClose: () => void
}

export default function OfferModal({ productId, toUserId, onClose }: OfferModalProps) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        setLoading(true)
        const { data: userData } = await supabase.auth.getUser()
        const fromUser = userData.user?.id
        if (!fromUser || !message.trim()) return
        
        const { error } = await supabase.from('offers').insert({
            from_user: fromUser,
            to_user: toUserId,
            product_id: productId,
            status: 'pending',
            message,
        })

        if (!error) setSent(true)
        setLoading(false)
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-zinc-800 p-6 rounded-lg w-full max-w-md text-white'>
                {sent ? (
                    <>
                        <h2 className='text-xl font-bold mb-4'>Offer Sent ✅</h2>
                        <button onClick={onClose} className='bg-blue-600 px-4 py-2 rounded mt-4 w-full'>
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className='text-xl font-bold mb-4'>Send an Offer</h2>
                        <textarea
                            className='w-full p-2 bg-zinc-700 border border-zinc-600 rounded'
                            rows={4}
                            placeholder="3 muza bir elma?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)} 
                        />
                        <div className='mt-4 flex justify-end gap-3'>
                            <button onClick={onClose} className='text-sm hover:underline'>Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className='bg-blue-600 px-4 py-2 rounded'
                            >
                                {loading ? 'Sending...' : 'Send Offer'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

