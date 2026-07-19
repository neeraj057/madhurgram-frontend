import { API_ENDPOINTS } from '@/apis/api';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  author: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
}

export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/public/blogs`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/public/blogs/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}
