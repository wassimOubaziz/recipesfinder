import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe) => {
    setFavorites(prev => [...prev, recipe]);
  };

  const removeFavorite = (recipeId) => {
    setFavorites(prev => prev.filter(recipe => recipe.idMeal !== recipeId));
  };

  const isFavorite = (recipeId) => {
    return favorites.some(recipe => recipe.idMeal === recipeId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
