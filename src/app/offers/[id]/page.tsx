"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from '../../lib/supabase'
import toast from "react-hot-toast"
import Image from "next/image"
import LoginRequired from "../../component/LoginRequired"
import UpdateOfferModal from "../../component/UpdateOfferModal"
import OfferChat from "../../component/OfferChat"

interface Offer {
  id: string
  message: string
  from_user: string
  to_user: string
  status: string
  product: {
    id: string
    title: string
    image_url: string
  }
}

export default function OfferDetailPage() {
  const params = useParams()
  const offerId = params?.id as string

  const [offer, setOffer] = useState<Offer | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffer = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (!user || authError) {
        toast.error("Please log in.")
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data, error } = await supabase
        .from("offers")
        .select(
          `*, product:products (id, title, image_url)`
        )
        .eq("id", offerId)
        .single()

      if (error) {
        toast.error("Offer not found")
      } else {
        setOffer(data)
      }

      setLoading(false)
    }

    fetchOffer()
  }, [offerId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse">Loading offer...</p>
      </div>
    )
  }

  if (!offer || !userId) return <LoginRequired />

  const isOwner = offer.from_user === userId

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Offer Detail</h1>

      <div className="bg-zinc-800 rounded-lg p-4 mb-6 shadow-md">
        <Image
          src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${offer.product.image_url}`}
          alt={offer.product.title}
          width={500}
          height={300}
          className="rounded w-full max-h-[300px] object-cover"
        />
        <h2 className="text-xl mt-3 font-semibold">{offer.product.title}</h2>
        <p className="mt-2 text-zinc-300">💬 {offer.message || "(No message)"}</p>
        <p className="mt-2 text-yellow-400 text-sm">Status: {offer.status}</p>
      </div>

      {isOwner && (
        <div className="mb-6">
          <UpdateOfferModal offerId={offer.id} />
        </div>
      )}

      <OfferChat offerId={offer.id} currentUserId={userId} />
    </div>
  )
}
