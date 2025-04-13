'use client';

import {useState} from 'react';
import {supabase} from '../lib/supabase';
import toast from 'react-hot-toast';

interface UpdateOfferModalProps {
    offerId: string
    currentMessage: string
    onClose: () => void
    onOfferUpdated?: () => void
    onOfferDeleted?: () => void
}

export default function UpdateOfferModal({
    offerId,
    currentMessage,
    onClose,
    onOfferDeleted,
    onOfferUpdated
}: UpdateOfferModalProps) {
    const [message, setMessage] = useState(currentMessage)
    const [loading, setLoading] = useState(false)

    const handleUpdate= async () => {
        setLoading(true)
        const {error} = await supabase
            .from('offers')
            .update({message})
            .eq('id', offerId)

        if (error) {
            toast.error('Update Failed')
        } else {
            toast.success('Offer updated')
            onOfferUpdated?.()
            onClose()
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this offer?')
        if (!confirm) return
        
        setLoading(true)
        const {error} = await supabase
            .from('offers')
            .delete()
            .eq('id', offerId)

        if (error) {
            toast.error('Delete failed.')
        } else {
            toast.success('Offer deleted.')
            onOfferDeleted?.()
            onClose()
        }

        setLoading(false)
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className='bg-zinc-800 p-6 rounded-xl w-[90%] max-w-md text-white animate-fadeIn shadow-xl space-y-4'>
          <h2 className='text-xl font-bold text-center'>Edit Your Offer</h2>
  
          <textarea
            className='w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
  
          <div className='flex flex-col sm:flex-row justify-between gap-2 text-sm'>
            <button
              onClick={onClose}
              className='text-zinc-400 hover:underline w-full sm:w-auto'
            >
              Cancel
            </button>
  
            <div className='flex gap-2 justify-end w-full sm:w-auto'>
              <button
                onClick={handleDelete}
                className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition active:scale-95'
                disabled={loading}
              >
                Delete
              </button>
              <button
                onClick={handleUpdate}
                className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition active:scale-95'
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }