'use client';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mb-6 w-full sm:w-1/2 px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600 placeholder:text-zinc-400"
            placeholder="Search..."
            aria-label="Search products.."
        /> 
    )
}