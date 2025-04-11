'use client';

import Link from 'next/link';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Home, Repeat, Plus, User } from 'lucide-react';

const navItems: {href: string; icon: React.ReactNode; label:string}[] = [
    {href: '/', icon: <Home size={20} />, label: 'Home'},
    {href: '/exchange', icon: <Repeat size={20} />, label: 'Exchange'},
    {href: '/add-product', icon: <Plus size={20} />, label: 'Add'},
    {href: '/profile', icon: <User size={20} />, label: 'Profile'},
]

export default function MobileNavbar() {
    const pathname = usePathname()

    return (
        <nav className='fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center h-14 sm:hidden z-50'>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center text-xs ${
                        pathname === item.href
                            ? 'text-blue-500'
                            : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    {item.icon}
                    <span className='text-[10px'>{item.label}</span>
                </Link>
            ))}
        </nav>
    )
}