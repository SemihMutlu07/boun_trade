'use client';

import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}