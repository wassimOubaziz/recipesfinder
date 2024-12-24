import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeResults from './RecipeResults';
import RecipeFilters from './RecipeFilters';
import { commonIngredients } from '../data/commonIngredients';
import { useFavorites } from '../hooks/useFavorites';

export default function SearchPage() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [displayedRecipes, setDisplayedRecipes] = useState(6);
  const [filters, setFilters] = useState({
    cuisine: '',
    maxTime: '',
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    }
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites } = useFavorites();
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const searchRecipesByIngredient = async (ingredient) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      if (response.data.meals) {
        // Fetch full details for each recipe
        const detailedRecipes = await Promise.all(
          response.data.meals.map(async (meal) => {
            const detailResponse = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            return detailResponse.data.meals[0];
          })
        );
        return detailedRecipes;
      }
      return [];
    } catch (err) {
      throw new Error('Failed to fetch recipes');
    }
  };

  const handleIngredientChange = (e) => {
    const value = e.target.value;
    setIngredients(value);
    
    // Get cursor position
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);

    // Find the current word being typed
    const textBeforeCursor = value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1].toLowerCase();

    // Show suggestions if user is typing
    if (currentLine.length > 0) {
      const matchingSuggestions = commonIngredients.filter(ingredient =>
        ingredient.toLowerCase().startsWith(currentLine)
      );
      setSuggestions(matchingSuggestions);
      setShowSuggestions(matchingSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const lines = ingredients.split('\n');
    lines[lines.length - 1] = suggestion;
    const newValue = lines.join('\n') + '\n';
    setIngredients(newValue);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  const handleSearch = async () => {
    const ingredientsArray = ingredients.split('\n')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);

    if (ingredientsArray.length === 0) {
      setError('Please enter at least one ingredient');
      return;
    }

    setIsLoading(true);
    setError('');
    setRecipes([]);
    setDisplayedRecipes(6);

    try {
      // Search using the first ingredient (API limitation for free tier)
      const results = await searchRecipesByIngredient(ingredientsArray[0]);
      if (results.length === 0) {
        setError('No recipes found with these ingredients. Try something else!');
      } else {
        setRecipes(results);
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    setDisplayedRecipes(prev => Math.min(prev + 6, recipes.length));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filterRecipes = (recipesToFilter) => {
    return recipesToFilter.filter(recipe => {
      // Filter by cuisine
      if (filters.cuisine && recipe.strArea !== filters.cuisine) {
        return false;
      }

      // Filter by preparation time (if available in API)
      if (filters.maxTime && recipe.cookTime > parseInt(filters.maxTime)) {
        return false;
      }

      // Filter by dietary restrictions
      if (filters.dietary.vegetarian && recipe.strCategory.toLowerCase().includes('meat')) {
        return false;
      }
      if (filters.dietary.vegan && 
          (recipe.strCategory.toLowerCase().includes('meat') || 
           recipe.strCategory.toLowerCase().includes('seafood'))) {
        return false;
      }
      // Add more dietary filters as needed

      return true;
    });
  };

  const getDisplayedRecipes = () => {
    let recipesToDisplay = showFavorites ? favorites : recipes;
    recipesToDisplay = filterRecipes(recipesToDisplay);
    return recipesToDisplay.slice(0, displayedRecipes);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 
                 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200"
    >
      <div className="container-custom py-12">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect Recipe
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enter your ingredients below and discover delicious recipes you can make today!
            </p>
          </div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-200">
            <div className="mb-6">
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ingredients
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="ingredients"
                  value={ingredients}
                  onChange={handleIngredientChange}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter ingredients (comma separated)"
                  className="w-full h-24 px-4 py-3 text-gray-700 dark:text-gray-200 
                           bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-400 dark:placeholder-gray-500
                           transition-colors duration-200"
                />

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 
                               border border-gray-200 dark:border-gray-600 rounded-xl 
                               shadow-lg max-h-60 overflow-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600
                                    ${index === 0 ? 'rounded-t-xl' : ''} 
                                    ${index === suggestions.length - 1 ? 'rounded-b-xl' : ''}
                                    text-gray-700 dark:text-gray-200 transition-colors duration-150`}
                          whileHover={{ x: 4 }}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              onClick={handleSearch}
              className="w-full px-6 py-3 text-lg font-semibold text-white 
                        bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl
                        hover:from-blue-700 hover:to-purple-700 
                        transform hover:-translate-y-0.5 active:translate-y-0
                        transition-all duration-150 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </div>
              ) : (
                'Search Recipes'
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <RecipeFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            showFavorites={showFavorites}
            onToggleFavorites={() => setShowFavorites(prev => !prev)}
          />

          <RecipeResults 
            recipes={getDisplayedRecipes()}
            isLoading={isLoading}
            error={error}
          />
          
          {getDisplayedRecipes().length < (showFavorites ? favorites.length : recipes.length) && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handleShowMore}
                className="inline-flex items-center px-6 py-3 text-lg font-semibold text-blue-600 dark:text-blue-400 
                          bg-blue-100 dark:bg-blue-900/30 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50
                          transform hover:-translate-y-0.5 transition-all duration-150"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show More Recipes
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
