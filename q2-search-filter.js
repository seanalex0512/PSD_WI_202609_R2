// ============================================
// Question 2: Search & Filter
// ============================================
// Implement functions that search and filter the movie database.
// These functions should NOT modify the original movies array.

import { movies } from './q1-watchlist-setup.js';

// TODO 2.1: Create the searchByTitle Function
// 1. Takes a `keyword` as a parameter (a string).
// 2. Returns a NEW array of movies whose title contains the keyword.
//    The search should be case-insensitive.
// 3. If no movies match, return an empty array.
function searchByTitle(keyword) {
  // Your code here
}

// TODO 2.2: Create the filterByGenre Function
// 1. Takes a `genre` as a parameter (a string).
// 2. Returns a NEW array of all movies that match the given genre.
//    The comparison should be case-insensitive.
// 3. If no movies match, return an empty array.
function filterByGenre(genre) {
  // Your code here
}

// TODO 2.3: Create the getTopRated Function
// 1. Takes a `count` parameter (a number).
// 2. Returns a NEW array of the top `count` movies sorted by rating (highest first).
// 3. If `count` is greater than the total number of movies, return all movies sorted by rating.
function getTopRated(count) {
  // Your code here
}

export { searchByTitle, filterByGenre, getTopRated };
