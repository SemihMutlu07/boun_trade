'use client';

import { useEffect, useState } from 'react';
import {supabase} from '../lib/supabase';

interface Comment {
    id: string
    message: string
    sender_id: string
    created_at: string
}

interface Props {
    offerId: string
    currentUserId: string
}

export default function OfferChat({ offerId, currentUserId }: Props) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('comments')
                .select("*")
                .eq('offer_id', offerId)
                .order('created_at', { ascending: false })

            if (!error && data) setComments(data)
        }

        fetchComments()
    }, [offerId])

    const handleSend = async () => {
        if (!newMessage.trim()) return

        const { error } = await supabase.from('comments').insert({
            offer_id: offerId,
            sender_id: currentUserId,
            message: newMessage.trim(),
        })

        if (!error) {
            setComments((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    offer_id: offerId,
                    sender_id: currentUserId,
                    message: newMessage.trim(),
                    created_at: new Date().toISOString(),
                },
            ])
            setNewMessage('')
        }
    }

    return (
        <div className='bg-zinc-800 rounded-lg p-4 mt-6'>
            <h3 className='text-lg font-semibold mb-3'>Offer Chat</h3>
            <div className='space-y-2 max-h-64 overflow-y-auto pr-2'>
                {comments.map((c) => (
                    <div
                        key={c.id}
                        className={`p-2 rounded text-sm ${
                            c.sender_id === currentUserId
                            ? 'bg-blue-600 text-white text-right ml-auto max-w-[80%]'
                            : 'bg-zinc-700 text-zinc-300 mr-auto max-w-[80%]'
                            }`}
                    >
                        {c.message}
                    </div>
                ))}
            </div>

            <div className='mt-3 flex gap-2'>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Dümenden bir teklif ver.'
                    className='flex-1 p-2 rounded bg-znc-700 border border-zinc-600'
                />
                <button
                    onClick={handleSend}
                    className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm'
                >
                    Send
                </button>
            </div>
        </div>
    )

}