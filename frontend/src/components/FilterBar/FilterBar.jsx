import { useRef } from 'react';
import { CATEGORIES } from '../../data/mockData.js';

export default function FilterBar({ selectedCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }

  return (
    <div className="sticky top-14 bg-surface-container-lowest z-30 border-b border-surface-variant">
      <div className="relative flex items-center">
        {/* Left scroll arrow */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 z-10 h-full px-1 items-center bg-gradient-to-r from-surface-container-lowest to-transparent"
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined text-on-surface text-[20px] bg-surface-container-lowest rounded-full p-0.5">
            chevron_left
          </span>
        </button>

        {/* Category chips */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-gutter md:px-lg py-3 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`
                  px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer
                  transition-colors h-8 flex items-center justify-center
                  text-label-md font-label-md flex-shrink-0
                  ${isActive
                    ? 'bg-on-surface text-surface-container-lowest'
                    : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right scroll arrow */}
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 z-10 h-full px-1 items-center bg-gradient-to-l from-surface-container-lowest to-transparent"
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined text-on-surface text-[20px] bg-surface-container-lowest rounded-full p-0.5">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
