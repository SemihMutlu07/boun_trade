"use client";

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log(error, router);
    }, [])
    
    const handleLogin = async() => {
        if (!email.endsWith('@boun.edu.tr')) {
            setError('Only boun.edu.tr emails are allowed')
            return
        } //malum rektör yüzünden mail adresi düzeltilecek.

        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            setError(error.message)
        } else {
            setError('')
            alert("Check your email for the login link.")
        }
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-4'>
            <h1 className='text-2xl font-bold mb-4'>Login</h1>
            <input
                type="email"
                placeholder="you@boun.edu.tr"
                className='border p-2 rounded w-full max-w-xs'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                onClick={handleLogin}
                className='bg-blue-600 text-white px-4 py-2 rounded mt-4'
            >
                Send Magic Link
            </button>
        </div>
    );
}