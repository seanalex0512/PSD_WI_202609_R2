// ============================================
// Question 3: Display Functions
// ============================================
// Implement functions that calculate stats and display the watchlist.

import { watchlist } from './q1-watchlist-setup.js';

// TODO 3.1: Create the getWatchlistCount Function
// Returns the total number of movies currently in the watchlist.
function getWatchlistCount() {
  // Your code here
}

// TODO 3.2: Create the getAverageRating Function
// 1. Takes an array of movie objects as a parameter.
// 2. If the array is empty, return 0.
// 3. Loops through the array and adds up all the `rating` values.
// 4. Divides the total by the number of movies.
// 5. Returns the average rounded to 1 decimal place.
function getAverageRating(moviesArray) {
  // Your code here
}

// TODO 3.3: Create the displayWatchlist Function
// 1. If the watchlist is empty, prints "Your watchlist is empty." using console.log().
// 2. Otherwise, prints "My Watchlist:" using console.log().
// 3. Loops through the watchlist and prints each movie in this format:
//      "- Title (Year) — Rating/10"
//    Example: "- Inception (2010) — 8.8/10"
// 4. At the end, prints the average rating of the watchlist by calling getAverageRating:
//      "Average Rating: X.X/10"
function displayWatchlist() {
  // Your code here
}

export { getWatchlistCount, getAverageRating, displayWatchlist };
