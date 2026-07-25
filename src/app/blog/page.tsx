import React from 'react';
import { Metadata } from 'next';
import { getAllBlogs } from '@/services/blogService';
import BlogCard from '@/components/features/blog/BlogCard';
import Link from 'next/link';
import BlogImage from '@/components/features/blog/BlogImage';

export const metadata: Metadata = {
  title: 'Village Stories & Health Blogs | MadhurGram',
  description: 'Read about the traditional village processes, benefits of organic food, and stories behind MadhurGram pure products.',
};

export default async function BlogIndexPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="bg-[#FAF9F5] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        
        <div className="mb-16 text-center animate-fadeIn">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
            MadhurGram Journal
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-wide md:text-5xl capitalize text-[#111111]">
            Village Stories & Wisdom
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Discover the ancient methods behind our pure foods, learn about their immense health benefits, and connect with the village roots that make our products truly authentic.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-400 tracking-widest text-sm border border-dashed border-[#EAE3D1] rounded-3xl bg-white/50">
            No stories published yet. Check back soon!
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {/* Featured Blog */}
            {blogs.length > 0 && (
              <Link href={`/blog/${blogs[0].slug}`} className="group relative w-full h-[60vh] min-h-[400px] rounded-3xl overflow-hidden block shadow-xl border border-[#D4AF37]/20 animate-slideUp">
                <BlogImage 
                  src={blogs[0].imageUrl} 
                  alt={blogs[0].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  fallbackSrc="/images/newlogo.svg"
                  fallbackClassName="absolute inset-0 w-full h-full object-contain p-12 opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                  <div className="inline-block text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase bg-[#F7D070] px-4 py-1.5 rounded-full mb-4 shadow-lg">
                    Featured • {blogs[0].category}
                  </div>
                  <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-[#F7D070] transition-colors max-w-4xl drop-shadow-md">
                    {blogs[0].title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-white/80 font-mono tracking-widest uppercase">
                    <span>{new Date(blogs[0].publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="text-[#D4AF37]">✦</span>
                    <span>By {blogs[0].author}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining Blogs Grid */}
            {blogs.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-16 animate-slideUp delay-200">
                {blogs.slice(1).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
