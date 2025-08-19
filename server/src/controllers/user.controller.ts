import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils";
import { CreateUserDto } from "../validators/user.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import config from "../config/config";
import { AuthenticatedRequest } from "../middlewares";
import axios from "axios";

export const UserRegister = async (req: Request, res: Response) => {
  const { username, email, firstName, lastName, password } = <CreateUserDto>(
    req.body
  );

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  const existingUsername = await UserModel.findOne({ username });

  if (existingUsername) {
    return sendError(res, "Username already exists", 400);
  }

  const existingEmail = await UserModel.findOne({ email });

  if (existingEmail) {
    return sendError(res, "Email already exists", 400);
  }

  try {
    await UserModel.create({
      username,
      email,
      firstName,
      lastName,
      hash: hashedPassword,
    });

    return sendSuccess(res, {
      message: "User registered successfully",
    });
  } catch (error) {
    return sendError(res, "Failed to register user", 500);
  }
};

export const UserLogin = async (req: Request, res: Response) => {
  console.log("UserLogin called with body:", req.body);
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (!user.hash) {
      return sendError(res, "Invalid password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash);
    if (!isPasswordValid) {
      return sendError(res, "Invalid password", 401);
    }

    if (!config.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000, // 1 hour
    });

    return sendSuccess(res, {
      message: "User logged in successfully",
      data: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return sendError(res, "Failed to log in user", 500);
  }
};

export const UserLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    });

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    return sendSuccess(res, { message: "User logged out successfully" });
  } catch (error) {
    return sendError(res, "Failed to log out user", 500);
  }
};

export const GetMe = async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.user;

  try {
    const userData = await UserModel.findOne({
      username,
    }).select("-hash");

    if (!userData) {
      return sendError(res, "User not found", 404);
    }
    return sendSuccess(res, {
      message: "User data retrieved successfully",
      data: userData,
    });
  } catch (error) {
    return sendError(res, "Failed to retrieve user data", 500);
  }
};

export const GetFavoriteRecipes = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // populate likedRecipes with recipe details
    const likedRecipesIds = user.likedRecipes;

    if (!likedRecipesIds || likedRecipesIds.length === 0) {
      return sendSuccess(res, [], "No favorite recipes found");
    }

    let populateData: any[] = [];

    await Promise.all(
      likedRecipesIds.map(async (id) => {
        const recipe = await axios(
          `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        populateData.push(recipe.data.meals[0]);
      })
    );

    console.log("Liked recipes IDs:", populateData);

    return sendSuccess(
      res,
      populateData,
      "Favorite recipes retrieved successfully"
    );
  } catch (error) {
    console.error("Error retrieving favorite recipes:", error);
    return sendError(res, "Failed to retrieve favorite recipes", 500);
  }
};

export const AddFavoriteRecipe = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { isFavorite, recipeId } = req.body;
  const userId = req.user.id;

  console.log("AddFavoriteRecipe called with body:", req.body);

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (!recipeId) {
      return sendError(res, "Recipe ID is required", 400);
    }

    if (!user.likedRecipes) {
      user.likedRecipes = [];
    }

    if (isFavorite) {
      user.likedRecipes.push(recipeId);
    } else {
      user.likedRecipes = user.likedRecipes.filter((id) => id !== recipeId);
    }
    await user.save();

    return sendSuccess(res, { message: "Recipe added to favorites" });
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    return sendError(res, "Failed to add favorite recipe", 500);
  }
};
