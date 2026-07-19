"use client";
import React from 'react';
import Link from 'next/link';
import { Blog } from '@/services/blogService';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link href={`/blog/${blog.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-[0_12px_30px_rgba(212,175,55,0.06)] hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {blog.imageUrl ? (
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = "/images/newlogo.svg?v=2"; e.currentTarget.className = "w-full h-full object-contain p-8 opacity-30" }}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full opacity-30 p-8">
            <img src="/images/newlogo.svg?v=2" alt="MadhurGram" className="max-h-full max-w-full object-contain" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          {blog.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono font-medium mb-3">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>By {blog.author}</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-[#111111] leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </div>
        <div className="mt-5 flex items-center text-[10px] font-bold text-[#111111] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
          Read Story <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
