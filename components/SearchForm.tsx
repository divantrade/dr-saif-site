"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface SearchFormProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchForm({
  initialValue = "",
  placeholder = "ابحث في المقالات…",
  className = "",
}: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`} role="search">
      <div className="relative">
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="البحث"
          className="w-full pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 shadow-sm"
        />
        <button
          type="submit"
          aria-label="بحث"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
