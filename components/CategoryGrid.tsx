
import React from 'react';
import { CategoryType } from '../types';

interface CategoryGridProps {
  onCategoryClick: (category: CategoryType) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryClick }) => {
  const categories = [
    { type: CategoryType.PHOTOBOOK, color: 'bg-white' },
    { type: CategoryType.SOUNDTRACK, color: 'bg-custom-lavender' },
    { type: CategoryType.KEYWORDS, color: 'bg-custom-lavender' },
    { type: CategoryType.MVP, color: 'bg-white' },
    { type: CategoryType.WIN, color: 'bg-white' },
    { type: CategoryType.MEAL, color: 'bg-custom-lavender' },
    { type: CategoryType.PURCHASE, color: 'bg-custom-lavender' },
    { type: CategoryType.GOAL, color: 'bg-white' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-xl mx-auto md:mx-0 p-1">
      {categories.map((cat, idx) => (
        <button
          key={idx}
          onClick={() => onCategoryClick(cat.type)}
          className={`${cat.color} hover:scale-[1.03] transition-transform duration-200 py-3 px-5 rounded-full text-custom-dark font-bold text-base shadow-md flex items-center justify-center whitespace-nowrap`}
        >
          {cat.type}
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
