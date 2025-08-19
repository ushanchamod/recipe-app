import type { CategoryType } from "../pages/Home";

interface RecipeSidebarProps {
  categories: CategoryType[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function RecipeSidebar({
  categories,
  activeCategory,
  onCategoryChange,
}: RecipeSidebarProps) {
  return (
    <div className="w-64 p-6 border-r border-gray-200 hidden md:block bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
      <nav className="space-y-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
            activeCategory === ""
              ? "bg-gray-800 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.idCategory}
            onClick={() => onCategoryChange(category.strCategory)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeCategory === category.strCategory
                ? "bg-gray-800 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {category.strCategory}
          </button>
        ))}
      </nav>
    </div>
  );
}

const Chip = ({
  label,
  onClick,
  isActive,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <div
      className={`bg-orange-400 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm w-fit cursor-pointer hover:bg-orange-500 transition-colors duration-200 ${
        isActive ? "bg-gradient-to-r from-orange-600 to-red-600" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export const MobileSidebar = ({
  categories,
  activeCategory,
  onCategoryChange,
}: RecipeSidebarProps) => {
  return (
    <div className="md:hidden p-4">
      <div className="flex flex-wrap gap-2">
        <Chip
          label="All"
          onClick={() => onCategoryChange("")}
          isActive={activeCategory === ""}
        />
        {categories.map((category) => (
          <Chip
            key={category.idCategory}
            label={category.strCategory}
            isActive={activeCategory === category.strCategory}
            onClick={() => onCategoryChange(category.strCategory)}
          />
        ))}
      </div>
    </div>
  );
};
