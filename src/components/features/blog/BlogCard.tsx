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
    <Link href={`/blog/${blog.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] border border-[#EAE3D1] hover:border-[#D4AF37]/50 hover:-translate-y-2 transition-all duration-500 h-full">
      <div className="relative h-64 w-full bg-[#FAF9F5] overflow-hidden">
        {blog.imageUrl ? (
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = "/images/newlogo.svg?v=2"; e.currentTarget.className = "w-full h-full object-contain p-8 opacity-30" }}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full opacity-30 p-8">
            <img src="/images/newlogo.svg?v=2" alt="MadhurGram" className="max-h-full max-w-full object-contain" />
          </div>
        )}
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-[#111111]/90 backdrop-blur text-[#F7D070] text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg border border-[#D4AF37]/30">
          {blog.category}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1 justify-between bg-white relative">
        {/* Accent line */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#EAE3D1] to-transparent" />
        
        <div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono font-medium mb-4 uppercase tracking-widest">
            <span>{formattedDate}</span>
            <span className="text-[#D4AF37]">✦</span>
            <span>{blog.author}</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#111111] leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-3">
            {blog.title}
          </h3>
        </div>
        <div className="mt-8 flex items-center text-xs font-bold text-[#111111] uppercase tracking-[0.2em] group-hover:text-[#D4AF37] transition-colors border-b border-transparent group-hover:border-[#D4AF37] pb-1 w-fit">
          Read Story <span className="ml-2 transition-transform duration-500 group-hover:translate-x-2">→</span>
        </div>
      </div>
    </Link>
  );
}
