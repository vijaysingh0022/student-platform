import React from "react";

export default function SubjectFilter({ categories, activeCategory, onSelectCategory }) {
  const defaultCategories = [
    { id: "all", label: "All Subjects" },
    { id: "core", label: "Core CSE" },
    { id: "placement", label: "Placement" },
    { id: "others", label: "Others" },
  ];

  const catList = categories || defaultCategories;

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 my-4">
      {catList.map((cat) => {
        const isSelected = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 flex-shrink-0 flex items-center gap-1.5 border ${
              isSelected
                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
