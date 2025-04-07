"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AddProductPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!imageFile) {
            setMessage('Please upload an image.')
            return
        }

        const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const imagePath = `${Date.now()}-${cleanName}`
        const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(imagePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type,
        })
        console.log("Uploading file:", {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
        })
      
        if (uploadError) {
            setMessage('Image upload failed.')
            return
        }

        const { data: userData } = await supabase.auth.getUser()
        const userId = userData?.user?.id
        if(!userId) return
        
        //inserting product to db
        const { error } = await supabase.from('products').insert({
            user_id: userId,
            title,
            description,
            category,
            image_url: imagePath,
        })
        
        if (error) {
            setMessage('Failed to add product.')
        } else {
            setMessage("Ürünün Eklendi!")
            setTitle('')
            setDescription('')
            setImageFile(null)
        }
    }

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
              {message && (
                <p className="text-center text-sm text-red-400 mt-2">{message}</p>
              )}
            </form>
          </div>
        </div>
      );      
}