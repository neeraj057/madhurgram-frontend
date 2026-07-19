import React from 'react';
import { Metadata } from 'next';
import { getBlogBySlug } from '@/services/blogService';
import Link from 'next/link';

interface BlogPageProps {
  params: { slug: string };
}

// Dynamic SEO Generation using SSR
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) {
    return { title: 'Story Not Found | MadhurGram' };
  }
  return {
    title: `${blog.title} | MadhurGram Stories`,
    description: blog.content.substring(0, 160).replace(/<[^>]*>?/gm, ''), // Strip HTML for meta desc
    openGraph: {
      images: [blog.imageUrl || '/images/newlogo.svg'],
    }
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen pt-32 pb-20 text-center">
        <h1 className="text-3xl font-serif text-[#111111]">Story not found</h1>
        <Link href="/blog" className="text-[#D4AF37] mt-4 inline-block hover:underline">
          ← Back to all stories
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-[#FAF9F5] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-16">
        
        {/* Back Link */}
        <div className="mb-8 animate-fadeIn">
          <Link href="/blog" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#D4AF37] transition-colors">
            ← Back to Stories
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-10 animate-fadeIn">
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            {blog.category}
          </span>
          <h1 className="mt-6 font-serif text-3xl md:text-5xl font-bold text-[#111111] leading-tight">
            {blog.title}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-500 font-mono">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="font-bold text-[#111111]">By {blog.author}</span>
          </div>
        </div>

        {/* Hero Image */}
        {blog.imageUrl && (
          <div className="w-full h-64 md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-lg animate-fadeIn">
            <img 
              src={blog.imageUrl} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article 
          className="prose prose-lg md:prose-xl prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#111111] prose-a:text-[#D4AF37] prose-p:text-gray-700 animate-fadeIn"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-16 pt-8 border-t border-gray-200 text-center animate-fadeIn">
          <p className="text-sm text-gray-500 mb-6">Experience the purity of our village products.</p>
          <Link href="/shop" className="bg-[#111111] text-[#FDFBF7] px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] hover:text-[#111111] transition-colors shadow-md">
            Explore the Shop
          </Link>
        </div>

      </div>
    </div>
  );
}
