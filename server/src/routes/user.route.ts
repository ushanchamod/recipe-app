import { Router } from "express";
import {
  AddFavoriteRecipe,
  GetFavoriteRecipes,
  GetMe,
  UserLogin,
  UserLogout,
  UserRegister,
} from "../controllers";
import { useGuard, validateData } from "../middlewares";
import { createUserSchema, loginUserSchema } from "../validators/user.dto";

const router = Router();

router.post("/register", validateData(createUserSchema), UserRegister);
router.post("/login", validateData(loginUserSchema), UserLogin);
router.post("/logout", UserLogout);
router.get("/me", useGuard, GetMe);
router.get("/favorite-recipes", useGuard, GetFavoriteRecipes);
router.patch("/favorite-recipes", useGuard, AddFavoriteRecipe);

export { router as userRouter };
