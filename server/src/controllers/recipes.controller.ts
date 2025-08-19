import { Request, Response } from "express";
import axios from "axios";
import { sendError, sendSuccess } from "../utils";
import { AuthenticatedRequest } from "../middlewares";
import { UserModel } from "../models";

export const GetRecipes = async (req: AuthenticatedRequest, res: Response) => {
  const { query } = req;
  const category = query.category || "";
  const name = query.name || "";
  const userId = req?.user?.id || "";
  try {
    // from name
    const apiUrlForName = `https://themealdb.com/api/json/v1/1/search.php?s=${name}`;
    const responseForName = await axios.get(apiUrlForName);
    let recipesWithName = responseForName.data.meals || [];

    if (userId) {
      const user = await UserModel.findById(userId);
      const likedRecipes = user?.likedRecipes ?? [];
      if (!user) throw new Error("User not found");

      recipesWithName = recipesWithName.map((recipe: any) => {
        console.log({
          likedRecipes,
          id: recipe.idMeal,
        });

        return {
          ...recipe,
          isFavorite: likedRecipes.includes(recipe.idMeal),
        };
      });
    }

    if (!category) {
      return sendSuccess(
        res,
        recipesWithName,
        "Recipes retrieved successfully"
      );
    } else {
      const apiUrlForCategory = `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      const responseForCategory = await axios.get(apiUrlForCategory);
      const recipesWithCategory = responseForCategory?.data;
      const recipesInCategory = recipesWithCategory?.meals || [];

      if (!name) {
        // populate
        const populateData: any = [];

        recipesInCategory.forEach((recipe: any) => {
          const a = recipesWithName.find(
            (nameRecipe: any) => nameRecipe.idMeal === recipe.idMeal
          );
          if (a) populateData.push(a);
        });

        return sendSuccess(res, populateData, "Recipes retrieved successfully");
      }
      const newData: any = [];
      recipesInCategory.forEach((recipe: any) => {
        const a = recipesWithName.find(
          (nameRecipe: any) => nameRecipe.idMeal === recipe.idMeal
        );
        if (a) newData.push(a);
      });

      return sendSuccess(res, newData, "Recipes retrieved successfully");
    }
  } catch (error: any) {
    console.error("Error fetching recipes:", error.message || error);
    return sendError(res, "Failed to retrieve recipes", 500, null);
  }
};

export const GetRecipesCategory = async (req: Request, res: Response) => {
  const { query } = req;
  console.log("Query:", query?.category);
  try {
    const apiUrl = `https://themealdb.com/api/json/v1/1/categories.php`;
    const response = await axios.get(apiUrl);
    const recipes = response.data;

    return sendSuccess(res, recipes, "Recipes retrieved successfully");
  } catch (error: any) {
    console.error("Error fetching recipes:", error.message || error);
    return sendError(res, "Failed to retrieve recipes", 500, null);
  }
};
