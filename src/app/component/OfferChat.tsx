'use client';

import { useEffect, useState } from 'react';
import {supabase} from '../lib/supabase';
import LoginRequired from './LoginRequired';
import toast from 'react-hot-toast';


interface Comment {
    id: string
    message: string
    sender_id: string
    created_at: string
}

interface Props {
    offerId: string
    currentUserId?: string
}

export default function OfferChat({ offerId, currentUserId }: Props) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [userId, setUserId] = useState<string | null>(currentUserId ?? null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if(!currentUserId) {
                const {data} = await supabase.auth.getUser();
                const fallbackUser = data.user;
                setUserId(fallbackUser?.id ?? null);
            }
            setLoading(false)
        };
        checkAuth();
    }, [currentUserId])

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


    if(userId) return null
    // value never read hatasından kurtulmak için, gerekirse düzeltilir.


    const handleSend = async () => {
        if (!newMessage.trim()) return

        const { error } = await supabase.from('comments').insert({
            offer_id: offerId,
            sender_id: currentUserId,
            message: newMessage.trim(),
        })

        if (!error) {
            toast.success('Message sent!')
            setComments((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                offer_id: offerId,
                sender_id: currentUserId!,
                message: newMessage.trim(),
                created_at: new Date().toISOString(),
              },
            ])
            setNewMessage('')
          } else {
            toast.error('Failed to send message.')
          }
    }

    if (!currentUserId) {
        return <p className="text-red-400 mt-4">Please log in to view or send messages.</p>
      }
      
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center text-white">
            <p className="animate-pulse">Checking authentication...</p>
          </div>
        )
      }
        
    if (!currentUserId) return <LoginRequired />
      

    return (
        <div className='bg-zinc-800 rounded-lg p-4 mt-6 shadow-md'>
            <h3 className='text-lg font-semibold mb-3'>Offer Chat</h3>
            <div className='space-y-2 max-h-64 overflow-y-auto pr-2'>
                {comments.map((c) => (
                    <div
                        key={c.id}
                        className={`p-2 rounded text-sm break-words ${
                            c.sender_id === currentUserId
                            ? 'bg-blue-600 text-white text-right ml-auto max-w-[80%]'
                            : 'bg-zinc-700 text-zinc-300 mr-auto max-w-[80%]'
                            }`}
                    >
                        {c.message}
                    </div>
                ))}
            </div>

            <div className='mt-4 flex gap-2'>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Dümenden bir teklif ver.'
                    className="flex-1 p-2 rounded-lg bg-zinc-700 border border-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm active:scale-95 transition'
                >
                    Send
                </button>
            </div>
        </div>
    )

}