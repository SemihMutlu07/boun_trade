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
        const isBOUN = email.endsWith('@boun.edu.tr');
        const { error: authError } = await supabase.auth.signInWithOtp({email});

        if (authError) {
            setError(authError.message);
            return;
        }

        const { data: {user}, error: sessionError } = await supabase.auth.getUser();

        if(sessionError || !user) {
            setError('User not found after sign-in');
            return;
        }

        const role = isBOUN ? 'student' : 'external';

        await supabase.from('users').upsert({
            id: user.id,
            email,
            role,
        });

        setError(null)
        alert('📩 Check your email for the magic login link!');
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-zinc-900 px-4 sm:px-8 py-12 text-white'>
            <div className='w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8 space-y-6'>
                <h1 className='text-3xl font-bold text-center'>Welcome Back 👋</h1>
                <p className='text-center text-zinc-400 text-sm'>Enter your <span className='font-medium text-blue-400'>@boun.edu.tr</span> email to sign in</p> {/*it will change, since std is an issue for mailing thx to :D*/}

                <input
                    type="email"
                    placeholder='you@boun.edu.tr'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-3 rounded-lg bg-zinc-700 placeholder-zinc-400 text-white focus:outline-none focus:ring-blue-500 focus:ring-2'
                />

                {error && (
                    <div className='bg-red-500 text-white text-sm p-2 px-3 rounded-lg'>
                        ⚠️ {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium'
                >
                    Send Magic Link
                </button>

                <p className='text-xs text-zinc-400 text-center'>
                    No password needed, just check your mail✨
                </p>
            </div>
        </div>
    );
}