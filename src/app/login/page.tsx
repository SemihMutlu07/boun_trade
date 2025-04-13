"use client";

import { useState, useEffect } from 'react'; 
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [emailInput, setEmailInput] = useState('');
    const router = useRouter();


    useEffect(() => {
        const checkSession = async () => {
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            toast.success('You are already logged in!');
            router.push('/exchange'); 
          }
        };
        checkSession();
      }, [router]);
    
    const handleLogin = async () => {
        toast.dismiss();

        const fullEmail = emailInput.includes('@')
            ? emailInput
            : `${emailInput}@std.bogazici.edu.tr`
        
        
        const { error } = await supabase.auth.signInWithOtp({ email: fullEmail });
    
        if (error) {
          toast.error(error.message);
          return;
        }
    
        toast.success('📩 Magic link sent! Check your email.');
    
      };

    return (
        <div className='min-h-screen flex items-center justify-center bg-zinc-900 px-4 sm:px-8 py-12 text-white'>
            <div className='w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8 space-y-6'>
                <h1 className='text-3xl font-bold text-center'>Welcome Back 👋</h1>
                <p className='text-center text-zinc-400 text-sm'>Enter your <span className='font-medium text-blue-400'>@std.bogazici.edu.tr</span> email to sign in</p> {/*it will change, since std is an issue for mailing thx to :D*/}

                <input
                    type="email"
                    placeholder='you@std.bogazici.edu.tr'
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className='w-full p-3 rounded-lg bg-zinc-700 placeholder-zinc-400 text-white focus:outline-none focus:ring-blue-500 focus:ring-2'
                />

                <button
                    onClick={handleLogin}
                    className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium'
                >
                    Send Magic Link
                </button>

                <p className='text-xs text-zinc-400 text-center'>
                    No password needed, just check your mail.
                </p>
            </div>
        </div>
    );
}