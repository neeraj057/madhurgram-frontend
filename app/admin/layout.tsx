import React from "react";
import { AdminSidebar } from "../../components/AdminSidebar"; // अपना पाथ चेक कर लेना भाई

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#111111] overflow-hidden font-sans">
      
      {/* 👈 लेफ्ट में हमारा फिक्स्ड साइडबार */}
      <AdminSidebar />
      
      {/* 👉 राइट में पेज का मेन कंटेंट जो राउट के हिसाब से बदलेगा */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {children}
      </div>
      
    </div>
  );
}