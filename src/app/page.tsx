'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import Link from 'next/link';

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session} }) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-center p-6 bg-zinc-900 text-white'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to BounTrade 🤝</h1>
      <p className='text-lg max-w-xl mb-8 text-zinc-400'>
        A campus-based TAKAS platform where students exchange goods easily and securely.
      </p>
      <div className='flex flex-col sm:flex-row gap-4'>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white font-medium"
        >
          Get Started
        </Link>
        <Link
          href="/exchange"
          className='border border-white hover:bg-white hover:text-black transition px-6 py-3 rounded-lg font-medium text-center'
        >
          Explore Items
        </Link>
      </div>
    </div>
  )
}