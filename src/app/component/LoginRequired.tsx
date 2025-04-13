'use client';

import Link from 'next/link';

export default function LoginRequired() {
    return (
        <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 text-center text-white'>
            <div className='bg-zinc-800 p-6 sm:p-8 rounded-lg max-w-md w-full animate-fade-in shadow-lg'>
                <h1 className='text-2xl sm:text-3xl font-bold mb-3'>🔒 Login Required</h1>
                <p className='text-zinc-400 text-sm sm:text-base mb-5'>
                    You must be logged in to access this page.
                </p>
                <Link
                    href='/login'
                    className='inline-block bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white sm:text-base transition'
                >
                    Go to Login
                </Link>
            </div>
        </div>
    )
}