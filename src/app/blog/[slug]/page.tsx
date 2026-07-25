import React from 'react';
import { Metadata } from 'next';
import { getBlogBySlug } from '@/services/blogService';
import Link from 'next/link';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO Generation using SSR
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
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
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

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
    <div className="bg-[#FAF9F5] min-h-screen pb-20">
      
      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] bg-[#111111]">
        {blog.imageUrl && (
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F5] via-black/40 to-black/10" />
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 pb-16 md:pb-24 pt-32">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 hover:text-[#D4AF37] transition-colors mb-8">
              <span className="text-[#D4AF37]">←</span> Back to Journal
            </Link>
            
            <div className="animate-slideUp">
              <span className="inline-block text-[10px] font-bold tracking-widest text-[#111111] uppercase bg-[#F7D070] px-4 py-1.5 rounded-full mb-6">
                {blog.category}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 drop-shadow-lg">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-4 text-xs text-white/80 font-mono tracking-wider">
                <span>{formattedDate}</span>
                <span className="text-[#D4AF37]">✦</span>
                <span className="font-bold text-white">By {blog.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-16 mt-16 md:mt-24">
        {/* Article Content - Editorial Style */}
        <article 
          className="prose prose-lg md:prose-xl prose-stone max-w-none 
          prose-headings:font-serif prose-headings:text-[#111111] prose-headings:font-bold
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-[#EAE3D1]
          prose-h3:text-2xl prose-h3:mt-8
          prose-a:text-[#D4AF37] prose-a:decoration-[#D4AF37]/30 hover:prose-a:decoration-[#D4AF37]
          prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:tracking-wide
          prose-blockquote:border-l-[3px] prose-blockquote:border-l-[#D4AF37] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#FDFBF7] prose-blockquote:to-transparent prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:shadow-sm prose-blockquote:font-serif prose-blockquote:text-2xl prose-blockquote:text-gray-800 prose-blockquote:italic
          prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-8 prose-li:mb-4
          prose-li:before:content-['✦'] prose-li:before:text-[#D4AF37] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-1 prose-li:before:text-sm
          [&>p:first-of-type]:first-letter:text-[90px] [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:text-[#D4AF37] [&>p:first-of-type]:first-letter:mr-4 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.7] [&>p:first-of-type]:first-letter:mt-3
          animate-fadeIn delay-300"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Elegant Author Bio */}
        <div className="mt-20 pt-12 border-t border-[#EAE3D1] animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-[#111111] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
              <span className="text-[#D4AF37] font-serif text-3xl font-bold">{blog.author.charAt(0)}</span>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-serif text-xl font-bold text-[#111111] mb-2">{blog.author}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Dedicated to bringing the authentic taste of the village to your table. We explore traditional methods, uncompromised purity, and the rich heritage of Indian farming.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fadeIn">
          <p className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">Experience the purity</p>
          <Link href="/#products" className="inline-block bg-[#111111] text-[#F7D070] px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#D4AF37] hover:text-[#111111] hover:scale-105 hover:shadow-[0_10px_20px_rgba(212,175,55,0.2)] transition-all duration-300">
            Explore Our Shop
          </Link>
        </div>

      </div>
    </div>
  );
}
