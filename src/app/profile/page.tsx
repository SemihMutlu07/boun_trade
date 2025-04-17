'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LoginRequired from '../component/LoginRequired'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  role: string
  display_name?: string | null
  department?: string | null
  image_url?: string | null
  public_profile?: boolean
  hide_email?: boolean
}

interface Product {
  id: string
  title: string
  image_url: string
}

interface Offer {
  id: string
  message: string
  from_user: string
  to_user: string
  product_id: string
  status: string
  product: {
    title: string
    id: string
    image_url: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [department, setDepartment] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [publicProfile, setPublicProfile] = useState(true)
  const [hideEmail, setHideEmail] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()

      if (!authUser || error) {
        setLoading(false)
        return
      }

      const { data: dbUser } = await supabase
        .from('users')
        .select('display_name, department, image_url, public_profile, hide_email')
        .eq('id', authUser.id)
        .single()

      setUser({
        id: authUser.id,
        email: authUser.email ?? '',
        role: '',
        display_name: dbUser?.display_name ?? '',
        department: dbUser?.department ?? '',
        image_url: dbUser?.image_url ?? '',
        public_profile: dbUser?.public_profile ?? true,
        hide_email: dbUser?.hide_email ?? false,
      })

      setDisplayName(dbUser?.display_name ?? '')
      setDepartment(dbUser?.department ?? '')
      setImageUrl(dbUser?.image_url ?? '')
      setPublicProfile(dbUser?.public_profile ?? true)
      setHideEmail(dbUser?.hide_email ?? false)

      const { data: userProducts } = await supabase
        .from('products')
        .select('id, title, image_url')
        .eq('user_id', authUser.id)

      setProducts(userProducts || [])

      const { data: userOffers } = await supabase
        .from('offers')
        .select(`
          *,
          product:products (
            id,
            title,
            image_url
          )
        `)
        .eq('from_user', authUser.id)

      setOffers(userOffers || [])

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (!user && !loading) return <LoginRequired />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse">Loading...</p>
      </div>
    )
  }

  const updateProfile = async () => {
    if (!user) return
    const { error } = await supabase
      .from('users')
      .update({ 
        display_name: displayName,
        department: department,
        image_url: imageUrl,
        public_profile: publicProfile,
        hide_email: hideEmail
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to update profile.')
    } else {
      toast.success('Profile updated')
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Logout Failed.')
    } else {
      toast.success('Logged out successfully!')
      router.push('/')
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (deleteError) {
      toast.error('Failed to delete account.')
      return
    }

    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      toast.error('Signed out error after deleting.')
      return
    }

    toast.success('Account deleted.')
    router.push('/')
  }

  return (
    <div className='min-h-screen p-4 sm:p-6 bg-zinc-900 text-white'>
      <h1 className='text-2xl font-bold mb-4'>My Profile</h1>
      <p className='text-zinc-400 text-sm'>Email: {user?.email}</p>

      <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-center'>
        {user?.image_url && (
          <Image
            src={user.image_url}
            alt='ProfilePicture'
            width={80}
            height={80}
            className='rounded-full object-cover mb-4'
          />
        )}
        <input
          className="p-2 mt-2 rounded bg-zinc-800 border border-zinc-700 w-full max-w-xs text-sm"
          type="text"
          placeholder="Profile image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          className='p-2 rounded bg-zinc-800 border border-zinc-700 w-full max-w-xs text-sm'
          type='text'
          placeholder='Display Name'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          className='p-2 rounded bg-zinc-800 border border-zinc-700 w-full max-w-xs text-sm'
          type='text'
          placeholder='Department'
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <div className='flex flex-col gap-1 text-sm'>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={publicProfile}
              onChange={(e) => setPublicProfile(e.target.checked)}
            />
            Public Profile
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={hideEmail}
              onChange={(e) => setHideEmail(e.target.checked)}
            />
            Hide Email
          </label>
        </div>
        <button
          className='px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700'
          onClick={updateProfile}
        >
          Save Changes
        </button>
      </div>

      <h2 className='text-xl mt-8 mb-2 font-semibold'>My Products</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {products.map((product) => (
          <div
            key={product.id}
            className='bg-zinc-800 p-4 rounded border border-zinc-700 animate-fade-in'
          >
            <Image
              src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
              alt={product.title}
              width={100}
              height={100}
              className='rounded object-cover'
            />
            <p className='mt-2 text-sm'>{product.title}</p>
          </div>
        ))}
      </div>

      <h2 className='text-xl mt-10 mb-3 font-semibold'>Sent Offers</h2>
      <ul className='space-y-4'>
        {offers.map((offer) => (
          <li
            key={offer.id}
            className='bg-zinc-800 p-4 rounded border border-zinc-700 animate-fade-in'
          >
            <p className='text-sm text-zinc-300 mb-2'>{offer.message}</p>
            <div className='flex items-center gap-4'>
              <Image
                src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${offer.product.image_url}`}
                alt={offer.product.title}
                width={60}
                height={60}
                className='rounded object-cover'
              />
              <p className='text-sm'>{offer.product.title}</p>
            </div>
            <p className='text-yellow-400 text-sm mt-2'>Status: {offer.status}</p>
          </li>
        ))}
      </ul>

      <div className='mt-10 flex flex-col sm:flex-row gap-4'>
        <button
          onClick={handleLogout}
          className='bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700'
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className='bg-red-600 px-4 py-2 rounded hover:bg-red-700'
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
