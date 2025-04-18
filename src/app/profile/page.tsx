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
  meeting_point?: string
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
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        .eq('users_id', authUser.id)

      setProducts(userProducts || [])

      const { data: userOffers } = await supabase
        .from('offers')
        .select(`*, product:products (id, title, image_url)`)
        .eq('from_user', authUser.id)

      const { data: received } = await supabase
        .from('offers')
        .select(`*, product:products (id, title, image_url)`) 
        .eq('to_user', authUser.id)

      setOffers(userOffers || [])
      setReceivedOffers(received || [])
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
    toast.loading('Updating profile...')
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
      toast.dismiss()
      console.error(error)
      toast.error('Failed to update profile.')
    } else {
      toast.dismiss()
      toast.success('Profile updated successfully!')
    }
  }

  const handleLogout = async () => {
    toast.loading('Logging out...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.dismiss()
      toast.error('Logout Failed.')
    } else {
      toast.dismiss()
      toast.success('Logged out successfully!')
      router.push('/')
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    toast.loading('Deleting account...')
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (deleteError) {
      toast.dismiss()
      toast.error('Failed to delete account.')
      return
    }

    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      toast.dismiss()
      toast.error('Signed out error after deleting.')
      return
    }

    toast.dismiss()
    toast.success('Account deleted.')
    router.push('/')
  }

  return (
    <div className='min-h-screen bg-zinc-900 text-white'>
      <div className='max-w-5xl mx-auto p-6'>

          {/* Received Offers */}
          <div className='bg-zinc-800 rounded-lg p-6 mb-8 border border-zinc-700'>
          <h2 className='text-xl font-semibold mb-5'>Received Offers</h2>

          {receivedOffers.length > 0 ? (
            <div className='space-y-4'>
              {receivedOffers.map((offer) => (
                <div key={offer.id} className='bg-zinc-900 p-4 rounded-lg border border-zinc-700'>
                  <div className='flex items-start gap-4'>
                    <div className='w-16 h-16 bg-zinc-800 rounded overflow-hidden'>
                      <Image
                        src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${offer.product.image_url}`}
                        alt={offer.product.title}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium'>{offer.product.title}</h3>
                      <p className='text-sm text-zinc-400 mt-1'>{offer.message}</p>
                      {offer.meeting_point && (
                        <p className='text-sm text-zinc-500 mt-1'>📍 {offer.meeting_point}</p>
                      )}
                      <p className='text-sm text-yellow-400 mt-2'>Status: {offer.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-zinc-400'>No received offers yet.</p>
          )}
        </div>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>My Profile</h1>
          <div className='flex gap-3'>
            <button
              onClick={handleLogout}
              className='flex items-center bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600 transition-colors text-sm'
            >
              Logout
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className='flex items-center bg-red-600/80 px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm'
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className='bg-zinc-800 rounded-lg p-6 mb-8 border border-zinc-700'>
          <h2 className='text-xl font-semibold mb-5'>Profile Information</h2>
          
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Profile Image Section */}
            <div className='flex flex-col items-center space-y-4 mb-6 md:mb-0'>
              <div className='w-32 h-32 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center'>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt='Profile Picture'
                    width={128}
                    height={128}
                    className='object-cover w-full h-full'
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-zinc-500">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className='w-full'>
                <input
                  className="p-2.5 rounded bg-zinc-900 border border-zinc-700 w-full text-sm"
                  type="text"
                  placeholder="Profile image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>
            
            {/* Profile Details Section */}
            <div className='flex-1 space-y-5'>
              <div>
                <label className='block text-sm font-medium text-zinc-400 mb-1'>Email</label>
                <div className='p-2.5 rounded bg-zinc-900 border border-zinc-700 text-sm select-none'>
                  {user?.email}
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-zinc-400 mb-1'>Display Name</label>
                  <input
                    className='p-2.5 rounded bg-zinc-900 border border-zinc-700 w-full text-sm'
                    type='text'
                    placeholder='Your Name'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-zinc-400 mb-1'>Department</label>
                  <input
                    className='p-2.5 rounded bg-zinc-900 border border-zinc-700 w-full text-sm'
                    type='text'
                    placeholder='Your Department'
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              
              <div className='flex flex-wrap gap-6 mt-4'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 accent-blue-500'
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                  />
                  <span className='text-sm'>Public Profile</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 accent-blue-500'
                    checked={hideEmail}
                    onChange={(e) => setHideEmail(e.target.checked)}
                  />
                  <span className='text-sm'>Hide Email</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className='flex justify-end mt-6'>
            <button
              className='px-5 py-2.5 bg-blue-600 rounded font-medium hover:bg-blue-700 transition-colors flex items-center gap-2'
              onClick={updateProfile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>

        {/* My Products Section */}
        <div className='bg-zinc-800 rounded-lg p-6 mb-8 border border-zinc-700'>
          <h2 className='text-xl font-semibold mb-5'>My Products</h2>
          
          {products.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-colors'
                  role="button"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <div className='w-full h-48 bg-zinc-800'>
                    <Image
                      src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${product.image_url}`}
                      alt={product.title}
                      width={400}
                      height={300}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='font-medium text-base mb-1'>{product.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-10 text-center text-zinc-400'>
              <p>You have not any products yet.</p>
              <button 
                className='mt-3 px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700'
                onClick={() => router.push('/add-product')}
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>

        {/* Sent Offers Section */}
        <div className='bg-zinc-800 rounded-lg p-6 border border-zinc-700'>
          <h2 className='text-xl font-semibold mb-5'>Sent Offers</h2>
          
          {offers.length > 0 ? (
            <div className='space-y-4'>
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className='bg-zinc-900 p-4 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors'
                >
                  <div className='flex items-start gap-4'>
                    <div className='w-16 h-16 flex-shrink-0 bg-zinc-800 rounded overflow-hidden'>
                      <Image
                        src={`https://srkswqjjdfkdddwemqtd.supabase.co/storage/v1/object/public/images/${offer.product.image_url}`}
                        alt={offer.product.title}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium'>{offer.product.title}</h3>
                      <p className='text-sm text-zinc-400 mt-1'>{offer.message}</p>
                      <div className='mt-2 flex items-center'>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            offer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            offer.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                            'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-10 text-center text-zinc-400'>
              <p>No offers sent yet.</p>
              <button 
                className='mt-3 px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700'
                onClick={() => router.push('/')}
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
          <div className='bg-zinc-800 rounded-lg max-w-md w-full p-6 border border-zinc-700'>
            <h3 className='text-xl font-bold mb-4'>Delete Account?</h3>
            <p className='text-zinc-300'>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.</p>
            
            <div className='flex justify-end gap-3 mt-6'>
              <button
                className='px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors'
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors'
                onClick={() => {
                  setShowDeleteConfirm(false)
                  handleDeleteAccount()
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}