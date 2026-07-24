import React from "react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "shop-all",
    name: "All",
    image: "/images/jaggery.png",
    color: "from-amber-200 to-yellow-400",
  },
  {
    id: "dairy",
    name: "Dairy & Ghee",
    image: "/images/cow_ghee.png",
    color: "from-yellow-300 to-amber-500",
  },
  {
    id: "sweeteners",
    name: "Sweeteners",
    image: "/images/jaggery_jar.png",
    color: "from-orange-300 to-amber-600",
  },
  {
    id: "oils",
    name: "Wood Pressed",
    image: "/images/mustard_oil.png",
    color: "from-yellow-100 to-yellow-300",
  },
  {
    id: "pickles",
    name: "Pickles",
    image: "/images/mango_pickle.png",
    color: "from-red-300 to-orange-500",
  }
];

interface VisualCategoryCirclesProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function VisualCategoryCircles({ activeCategory, onSelectCategory }: VisualCategoryCirclesProps) {
  return (
    <section className="w-full py-6 bg-transparent overflow-hidden border-b border-[#EAE3D1]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center font-serif">Explore By Category</h2>
        <div className="flex overflow-x-auto gap-4 md:gap-8 pb-6 pt-2 scrollbar-hide snap-x px-4 justify-start md:justify-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col items-center gap-3 snap-center shrink-0 focus:outline-none"
              >
                {/* Circle Container */}
                <div 
                  className={`
                    relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] transition-all duration-300 ease-out
                    ${isActive ? `bg-gradient-to-tr ${cat.color} scale-110 shadow-lg` : 'bg-gray-200 group-hover:bg-gray-300'}
                  `}
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                    <Image 
                      src={cat.image} 
                      alt={cat.name} 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-600 shadow-sm border border-white" />
                  )}
                </div>
                
                {/* Category Name */}
                <span 
                  className={`
                    text-xs md:text-sm font-semibold whitespace-nowrap transition-colors duration-300
                    ${isActive ? 'text-amber-700' : 'text-gray-600 group-hover:text-gray-900'}
                  `}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
