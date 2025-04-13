"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LoginRequired from '../component/LoginRequired'
import toast from 'react-hot-toast';


interface User {
  id: string
  email: string 
  role: string
  display_name?: string | null
}

export default function AddProductPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const checkAuth = async () => {
        const {data} = await supabase.auth.getUser()
        const authUser = data.user

        if(authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email ?? '',
            role: '',
          });
        }

        setLoading(false);
      }

      checkAuth()
    }, [])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white">
          <p className="animate-pulse">Checking authentication...</p>
        </div>
      )
    }

    if (!user) return <LoginRequired />;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!user) {
        toast.error('Login required');
        return;
      }
  
      const cleanTitle = title.trim();
      const cleanDesc = description.trim();
  
      if (!cleanTitle || !cleanDesc || !category) {
        toast.error('Please fill all fields.');
        return;
      }
  
      let imagePath = '';
  
      if (imageFile) {
        const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
        imagePath = `${Date.now()}-${cleanName}`;
  
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(imagePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          });
  
        if (uploadError) {
          toast.error('Image upload failed.');
          return;
        }
      }
  
      const { error: insertError } = await supabase.from('products').insert({
        user_id: user.id,
        title: cleanTitle,
        description: cleanDesc,
        category,
        image_url: imagePath, // if no image, store empty string
      });
  
      if (insertError) {
        toast.error('Failed to add product.');
        return;
      }
  
      toast.success("Product added!");
      setTitle('');
      setDescription('');
      setImageFile(null);
    };
  

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white p-4">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Add Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full bg-zinc-700 border border-zinc-600 p-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full bg-zinc-700 border border-zinc-600 p-2 rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select
                className="w-full bg-zinc-700 border border-zinc-600 p-2 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="food">Food</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
              </select>
              <input
                type="file"
                accept="image/*"
                className="text-sm border border-zinc-600 p-2 rounded w-full bg-zinc-700 hover:bg-zinc-600"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      );      
}