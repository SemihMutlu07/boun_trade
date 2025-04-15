"use client";

import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; 
import toast from 'react-hot-toast';



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
        if (loading) return;

        setLoading(true);
        toast.dismiss();
        
        const { data: userData } = await supabase.auth.getUser()
        const fromUser = userData.user?.id

        if(!fromUser) {
            toast.error('Login required.');
            setLoading(false);
            return;
        }

        if (!message.trim()) {
            toast.error('Please write a message :(');
            setLoading(false);
            return;
        }
        
        const {data: existingOffers, error: checkError } = await supabase
            .from('offers')
            .select('id')
            .eq('from_user', fromUser)
            .eq('product_id', productId);
        
        if (checkError) {
            toast.error('Failed to check existing offers.');
            setLoading(false);
            return;
        }

        if (existingOffers && existingOffers.length > 0) {
            toast.error('You already sent an offer for this product.');
            setLoading(false);
            return;
        }

        const {error} = await supabase.from('offers').insert({
            from_user: fromUser,
            to_user: toUserId, 
            product_id: productId,
            status: 'pending',
            message,
        });

        if(!error) {
            toast.success('✅ Offer sent successfully!');
            setSent(true);
        } else {
            toast.error('Offer submission failed.')
        }
          
        setLoading(false)
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-zinc-800 p-6 rounded-xl w-[90%] max-w-md text-white animate-fadeIn shadow-xl'>
                {sent ? (
                    <>
                        <h2 className='text-xl font-bold mb-4 text-center'>Offer Sent ✅</h2>
                        <button 
                            onClick={onClose} 
                            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full text-sm font-medium transition active:scale-95'>
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className='text-xl font-bold mb-4 text-center'>Send an Offer</h2>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className='w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                                rows={4}
                                placeholder="3 muza bir elma?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)} 
                                disabled={loading}
                            />
                            <div className='mt-4 flex justify-between items-center text-sm'>
                                <button 
                                    type='button'
                                    onClick={onClose} 
                                    className='text-zinc-400 hover:underline'
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    type='submit'
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium transition active:scale-95'
                                >
                                    {loading ? 'Sending...' : 'Send Offer'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

