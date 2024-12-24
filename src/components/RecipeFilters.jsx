import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const cuisineTypes = [
  'All',
  'American',
  'British',
  'Chinese',
  'French',
  'Indian',
  'Italian',
  'Japanese',
  'Mexican',
  'Thai',
  'Mediterranean'
];

const dietaryRestrictions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'glutenFree', label: 'Gluten Free' },
  { id: 'dairyFree', label: 'Dairy Free' }
];

export default function RecipeFilters({ 
  filters, 
  onFilterChange, 
  showFavorites,
  onToggleFavorites 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cuisine Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cuisine Type
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => onFilterChange('cuisine', e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          >
            {cuisineTypes.map((cuisine) => (
              <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Preparation Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Preparation Time
          </label>
          <select
            value={filters.maxTime}
            onChange={(e) => onFilterChange('maxTime', e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          >
            <option value="">Any Time</option>
            <option value="30">30 minutes or less</option>
            <option value="45">45 minutes or less</option>
            <option value="60">1 hour or less</option>
          </select>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dietary Restrictions
          </label>
          <div className="space-y-2">
            {dietaryRestrictions.map((restriction) => (
              <label key={restriction.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.dietary[restriction.id]}
                  onChange={(e) => 
                    onFilterChange('dietary', {
                      ...filters.dietary,
                      [restriction.id]: e.target.checked
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 
                           focus:ring-blue-500 dark:border-gray-600
                           dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {restriction.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Favorites Toggle */}
        <div className="flex items-end">
          <button
            onClick={onToggleFavorites}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                      transition-all duration-200 ${
                        showFavorites
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
          >
            <svg
              className={`w-5 h-5 ${
                showFavorites ? 'fill-current' : 'stroke-current fill-none'
              }`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {showFavorites ? 'Show All Recipes' : 'Show Favorites'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

RecipeFilters.propTypes = {
  filters: PropTypes.shape({
    cuisine: PropTypes.string.isRequired,
    maxTime: PropTypes.string.isRequired,
    dietary: PropTypes.object.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  showFavorites: PropTypes.bool.isRequired,
  onToggleFavorites: PropTypes.func.isRequired,
};
