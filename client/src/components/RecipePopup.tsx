import PopUp from "./ui/PopUp";
import { usePopUpStore } from "../stores/usePopup";
import { BookOpen, Youtube } from "lucide-react";

const RecipePopup = () => {
  const { recipe, setRecipe } = usePopUpStore();

  if (!recipe) return null;

  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient =
      recipe.all[`strIngredient${i}` as keyof typeof recipe.all];
    const measure = recipe.all[`strMeasure${i}` as keyof typeof recipe.all];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
    }
  }

  return (
    <PopUp
      title={recipe.all.strMeal}
      setAddNewPopup={setRecipe}
      loading={false}
    >
      <div className="flex flex-col gap-6 w-full p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
        {/* Thumbnail */}
        {recipe.all.strMealThumb && (
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm group">
            <img
              src={recipe.all.strMealThumb}
              alt={recipe.all.strMeal}
              className="w-full h-64 sm:h-80 object-cover transform group-hover:scale-105 transition duration-500"
            />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm sm:text-base text-gray-700">
          <span className="px-3 py-1 bg-white rounded-full shadow-sm">
            <strong className="text-gray-800">Category:</strong>{" "}
            {recipe.all.strCategory}
          </span>
          <span className="px-3 py-1 bg-white rounded-full shadow-sm">
            <strong className="text-gray-800">Area:</strong>{" "}
            {recipe.all.strArea}
          </span>
          {recipe.all.strTags && (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full shadow-sm">
              <strong>Tags:</strong> {recipe.all.strTags}
            </span>
          )}
        </div>

        {/* Ingredients */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold text-xl mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold text-xl mb-3 text-gray-900 border-b border-gray-200 pb-2">
            Instructions
          </h3>
          <p className="whitespace-pre-line leading-relaxed text-gray-700">
            {recipe.all.strInstructions}
          </p>
        </div>

        {/* External Links */}
        <div className="flex flex-wrap gap-4 mt-4">
          {recipe.all.strYoutube && (
            <a
              href={recipe.all.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              <Youtube size={20} /> Watch on YouTube
            </a>
          )}
          {recipe.all.strSource && (
            <a
              href={recipe.all.strSource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition"
            >
              <BookOpen size={20} /> Source
            </a>
          )}
        </div>
      </div>
    </PopUp>
  );
};

export default RecipePopup;
