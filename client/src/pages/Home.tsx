import { useState } from "react";
import { RecipeCard } from "../components/RecipeCard";
import { MobileSidebar, RecipeSidebar } from "../components/RecipeSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import Loading from "../components/ui/Loading";
import ErrorPage from "../components/ui/ErrorPage";
import SearchComponent from "../components/Search";

export type recipeType = {
  all: any;
  mealId: string;
  mealName: string;
  categoryName: string;
  areaName: string;
  instructions: string;
  thumbnail: string;
  liked: boolean;
};

export type CategoryType = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

export default function RecipeApp() {
  const { fetchData } = useAxios();
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState({
    field: "",
    fieldDebounceValue: "",
  });

  const fetchRecipes = async (name = "", category = "") => {
    try {
      const response = await fetchData({
        url: `/recipes?name=${name}&category=${category}`,
      });

      if (!response.data) {
        return [];
      }

      return response.data.map((meal: any) => ({
        all: meal,
        mealId: meal.idMeal,
        mealName: meal.strMeal,
        categoryName: meal.strCategory,
        areaName: meal.strArea,
        instructions: meal.strInstructions,
        thumbnail: meal.strMealThumb,
        liked: meal.isFavorite,
      })) as recipeType[];
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchData({
        url: `/recipes/category`,
      });

      if (!response.data || !response.data.categories) {
        return [];
      }

      return response.data.categories.slice(0, 5).map((category: any) => ({
        idCategory: category.idCategory,
        strCategory: category.strCategory,
        strCategoryThumb: category.strCategoryThumb,
        strCategoryDescription: category.strCategoryDescription,
      })) as CategoryType[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      "home-recipes",
      { searchQuery: searchQuery.fieldDebounceValue, activeCategory },
    ],
    queryFn: async () =>
      await fetchRecipes(searchQuery.fieldDebounceValue, activeCategory),
  });

  const { data: categories } = useQuery({
    queryKey: ["home-categories"],
    queryFn: async () => await fetchCategories(),
  });

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-200 overflow-auto md:overflow-hidden">
      <div className="flex flex-col md:flex-row md:h-full">
        {/* Sidebar: Fixed width on desktop, hidden on mobile with toggle option */}
        <RecipeSidebar
          categories={categories ?? []}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-100/80 backdrop-blur-sm h-full overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                Delicious Recipes
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Discover amazing recipes for every occasion
              </p>
            </div>

            <div className="relative mb-0 max-w-lg">
              <SearchComponent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            <MobileSidebar
              categories={categories ?? []}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <div className="relative h-full">
              {isLoading && (
                <div className="mt-50">
                  <Loading />
                </div>
              )}

              {isError && <ErrorPage message="Error fetching recipes" />}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {data?.map((recipe) => (
                    <motion.div
                      key={recipe.mealId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.91 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <RecipeCard recipe={recipe} liked={recipe.liked} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {data?.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No recipes found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
