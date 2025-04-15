'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({data}) => {
            setIsLoggedIn(!!data.user);
        }) 
    }, [])

    const navItems = [
        { href: '/exchange', label: 'Exchange', icon: Home },
        { href: '/add-product', label: 'Add', icon: Plus },
        { href: '/profile', label: 'Profile', icon: User },
      ]
    
    return (
        <>
            <div className='hidden lg:flex fixed top-0 left-0 w-full h-16 bg-zinc-900 border-b border-zinc-700 z-50'>
                <div className='max-w-6xl mx-auto w-full flex items-center justify-between px-6'>
                    <h1 className='text-white font-bold text-lg'>TAKAS</h1>
                    <nav className='flex gap-6'>
                        {navItems.map(({href, label}) => (
                            <Link
                                key={href}
                                href={href}
                                className={`text-sm hover:text-blue-400 transition ${
                                    pathname === href ? 'text-blue-500' : 'text-white'    
                                }`}
                            >
                                {label}
                            </Link>
                        ))}

                        {!isLoggedIn && (
                            <Link
                                href="/login"
                                className='text-sm text-white hover:text-blue-500 transition'
                            >
                                Log In
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </>
    )
}