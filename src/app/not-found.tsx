"use client";

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';

const images = [
    "public/pass_1.png",
    "public/pass_2.png"
]

export default function NotFound() {
    const [randomImage, setRandomImage] = useState(images[0])

    useEffect(() => {
        const index = Math.floor(Math.random() * images.length)
        setRandomImage(images[index])
    },[])

    return (
        <div className='relative min-h-screen flex flex-col items-center justify-center text-center px-4'>
            <Image
                src={randomImage}
                alt="You SHALL NOOOOOOT PASSS"
                fill
                objectFit='cover'
                className='z-0 opacity-70'
                priority
            />

            <div className='absolute inset-0 bg-black/60 z-10'/>

            <div className='relative z-20 max-w-md text-white'>
                <h1 className='text-5xl sm:text-6xl font-bold text-orange mb-4'>404</h1>
                <p className='text-xl sm:text-2xl font-semibold mb-2'>You shall not pass!</p>
                <p className='text-sm sm:text-base text-gray-3000 mb-6'>
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-2 rounded font-medium text-white text-sm sm:text-base"
                    >
                    Go to home.
                </Link>
            </div>
        </div>
    )
}