import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. यूज़र किस पाथ पर जाना चाहता है?
  const path = request.nextUrl.pathname;

  // 2. क्या यह एडमिन का राउट है?
  const isAdminRoute = path.startsWith('/admin');
  const isLoginRoute = path === '/admin/login';

  // 3. Cookie से टोकन निकालो
  const token = request.cookies.get('adminToken')?.value || '';

  // 🔴 नियम 1: अगर एडमिन पेज पर जा रहा है (लॉगिन छोड़कर) और चाबी (टोकन) नहीं है, तो उसे धक्के मार कर लॉगिन पर भेजो।
  if (isAdminRoute && !isLoginRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 🟢 नियम 2: अगर पहले से लॉगिन है (टोकन है) और फिर भी लॉगिन पेज खोल रहा है, तो सीधा डैशबोर्ड (प्रोडक्ट्स) पर भेजो।
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin/products', request.url));
  }

  // बाकी सबको शांति से जाने दो
  return NextResponse.next();
}

// 🎯 यह बाउंसर सिर्फ /admin वाले राउट्स पर ही पहरा देगा (परफॉरमेंस बचाने के लिए)
export const config = {
  matcher: ['/admin/:path*'],
};