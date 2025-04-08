'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Image from 'next/image'
import OfferModal from '../../component/OfferModal'

interface Product {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  is_traded: boolean
  user_id: string
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null)
    })
  }, [])

  return (
    <div className="min-h-screen p-6 bg-zinc-900 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="relative w-full h-64 mb-6 rounded overflow-hidden">
          <Image
            src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-zinc-400 mt-2">{product.description}</p>
        <span className="inline-block mt-4 bg-zinc-800 px-3 py-1 text-sm rounded">
          {product.category}
        </span>

        {product.is_traded ? (
          <p className="mt-6 text-red-400">This product has already been traded</p>
        ) : currentUserId !== product.user_id ? (
          <div className="mt-6">
            <p className="text-sm text-zinc-300">You can send an offer for this item.</p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Send Offer
            </button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-yellow-400">You own this item</p>
        )}

        {isOpen && (
          <OfferModal
            productId={product.id}
            toUserId={product.user_id}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
