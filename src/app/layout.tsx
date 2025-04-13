'use client';

import { useEffect } from 'react';
import {Toaster} from 'react-hot-toast';
import { supabase } from './lib/supabase';
import './globals.css';
import MobileNavbar from './component/MobileNavbar';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saveUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user || error) return
      
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
      })
    }

    saveUser()
  }, [])

  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
            padding: '12px 16px',
          },
          success: {
            icon: '✅',
          },
          error: {
            icon: '❌',
          },
        }} />
        <MobileNavbar/>
      </body>
    </html>
  );
}