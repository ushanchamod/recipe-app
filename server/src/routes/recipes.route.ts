import { Router } from "express";
import {
  GetRecipes,
  GetRecipesCategory,
} from "../controllers/recipes.controller";
import { useGuardOptional } from "../middlewares";

const router = Router();

router.get("/", useGuardOptional, GetRecipes);
router.get("/category", GetRecipesCategory);

export { router as recipeRouter };
