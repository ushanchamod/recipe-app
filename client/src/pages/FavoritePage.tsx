import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import ErrorPage from "../components/ui/ErrorPage";
import { AnimatePresence, motion } from "framer-motion";
import type { recipeType } from "./Home";
import { RecipeCard } from "../components/RecipeCard";
import Loading from "../components/ui/Loading";

const FavoritePage = () => {
  const { fetchData } = useAxios();

  const fetchFavoriteRecipes = async () => {
    try {
      const response = await fetchData({
        url: `/user/favorite-recipes`,
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
      console.error("Error fetching favorite recipes:", error);
      throw error;
    }
  };

  const { isLoading, isPending, isError, data } = useQuery({
    queryKey: ["favorite-page-recipes"],
    queryFn: async () => await fetchFavoriteRecipes(),
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage message="Error fetching favorite recipes" />;
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 h-full overflow-auto">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Favorite Recipes
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Here you can find all your favorite recipes saved in one place.
          </p>
        </div>
        {isError && <ErrorPage message="Error fetching recipes" />}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {data?.map((recipe) => (
              <motion.div
                key={recipe.mealId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <RecipeCard recipe={recipe} liked={true} />
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
  );
};

export default FavoritePage;
