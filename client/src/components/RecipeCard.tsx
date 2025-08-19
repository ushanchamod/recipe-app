import {
  Heart as HeartOutline,
  Heart as HeartFilled,
  MapPin,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";
import { useAuthStore } from "../stores/useAuthStore";
import { usePopUpStore } from "../stores/usePopup";
import type { recipeType } from "../pages/Home";

interface RecipeCardProps {
  recipe: recipeType;
  liked: boolean;
}

export function RecipeCard({ recipe, liked }: RecipeCardProps) {
  const { fetchData } = useAxios();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { setRecipe } = usePopUpStore();

  const heartControls = useAnimation();
  const [localLiked, setLocalLiked] = useState(liked);

  useEffect(() => {
    setLocalLiked(liked);
  }, [liked]);

  const toggleFavorite = async (recipeId: string, isFavorite: boolean) => {
    if (!user) throw new Error("User not authenticated");

    await fetchData({
      url: `/user/favorite-recipes`,
      method: "patch",
      data: { recipeId, isFavorite },
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      recipeId,
      isFavorite,
    }: {
      recipeId: string;
      isFavorite: boolean;
    }) => toggleFavorite(recipeId, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-page-recipes"] });
      toast.success("Recipe favorite updated successfully", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message, {
          autoClose: 2000,
          position: "bottom-right",
        });
      } else {
        toast.error("An error occurred during updating recipe favorite", {
          autoClose: 2000,
          position: "bottom-right",
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["home-recipes"] });
    },
  });

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ prevent card click from firing

    if (!user) {
      toast.info("Please login to favorite recipes", { autoClose: 2000 });
      return;
    }

    setLocalLiked(!localLiked);
    await heartControls.start({
      scale: [1, 1.3, 1],
      transition: { duration: 0.3, ease: "easeInOut" },
    });
    mutate({ recipeId: recipe.mealId, isFavorite: !localLiked });
  };

  const onCardClick = () => {
    setRecipe(recipe);
  };

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg w-full max-w-[360px] border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onCardClick}
    >
      {/* Thumbnail Section */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={recipe.thumbnail || "/placeholder.webp"}
          alt={recipe.mealName}
          className="w-full h-full object-cover transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-white/90 text-orange-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            {recipe.categoryName}
          </div>
          <motion.button
            className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            animate={heartControls}
            onClick={handleHeartClick}
            disabled={isPending}
          >
            {localLiked ? (
              <HeartFilled
                className="h-4 w-4 text-red-500"
                fill="currentColor"
              />
            ) : (
              <HeartOutline className="h-4 w-4 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 bg-gradient-to-b from-white to-gray-50 flex flex-row gap-3 justify-between items-center">
        <h3 className="font-semibold text-xl text-gray-900  line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
          {recipe.mealName}
        </h3>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span className="font-medium">{recipe.areaName}</span>
        </div>
      </div>
    </motion.div>
  );
}
