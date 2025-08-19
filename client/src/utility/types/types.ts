export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb?: string;
  strCategoryDescription?: string;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions?: string;
  strArea?: string;
  strTags?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

export interface User {
  email: string;
  token?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}
