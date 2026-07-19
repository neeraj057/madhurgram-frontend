import React from 'react';
import { Metadata } from 'next';
import { getAllBlogs } from '@/services/blogService';
import BlogCard from '@/components/features/blog/BlogCard';

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
          <div className="text-center py-20 text-gray-400 tracking-widest text-sm border border-dashed border-gray-300 rounded-2xl bg-white/50">
            No stories published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
