import { create } from "zustand";
import type { recipeType } from "../pages/Home";

interface PopUpStore {
  recipe: null | recipeType;
  setRecipe: (recipe: null | recipeType) => void;
}

export const usePopUpStore = create<PopUpStore>((set) => ({
  recipe: null,
  setRecipe: (recipe) => set({ recipe }),
}));
