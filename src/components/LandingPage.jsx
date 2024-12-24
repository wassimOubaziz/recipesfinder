import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <main className="flex-grow flex items-center">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
              Find Amazing Recipes with
              <span className="block text-blue-600 dark:text-blue-400">
                Ingredients You Have
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Turn your available ingredients into delicious meals. No more wasting food or wondering what to cook!
            </p>
            <button 
              onClick={() => navigate('/search')}
              className="btn-primary"
            >
              Start Searching
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find recipes based on ingredients you already have in your kitchen
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant recipe suggestions with detailed instructions
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time & Money</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reduce food waste and make the most of what you have
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container-custom text-center text-gray-600 dark:text-gray-400">
          <p> {new Date().getFullYear()} RecipeFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
