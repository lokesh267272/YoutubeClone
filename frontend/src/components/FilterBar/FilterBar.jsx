import { CATEGORIES } from '../../data/categories.js';

export default function FilterBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="sticky top-14 bg-surface-container-lowest z-30 border-b border-surface-variant">
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-gutter md:px-lg py-3">
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
    </div>
  );
}
