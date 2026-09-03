// ============================================
// Question 1: Watchlist Setup
// ============================================
// Set up the movie database and build functions to manage a personal watchlist.
// Read each TODO carefully and implement the required code.

// TODO 1.1: Create the Movies Array
// Create an array called `movies` that contains 5 movie objects.
// Each movie object must have the following properties:
//   - id:     a unique number (1, 2, 3, 4, 5)
//   - title:  a string (the movie's name)
//   - genre:  a string (e.g. "Action", "Drama", "Sci-Fi", "Comedy", "Horror")
//   - year:   a number (the release year)
//   - rating: a number out of 10 (e.g. 8.5)
//
// You may choose any 5 movies you like.
var movies = []; // Replace this with your 5 movie objects

// TODO 1.2: Create the Watchlist Array
// Create an empty array called `watchlist` that will store movies added by the user.
var watchlist; // Replace this with the correct value

// TODO 1.3: Create the addToWatchlist Function
// 1. Takes a `movieId` as a parameter.
// 2. Finds the movie from the `movies` array that matches the ID.
// 3. If the movie is already in the watchlist, do NOT add it again — return false.
// 4. Adds the movie object to the watchlist array.
// 5. Returns true if successful, or false if the movie was not found or was already added.
function addToWatchlist(movieId) {
  // Your code here
}

// TODO 1.4: Create the removeFromWatchlist Function
// 1. Takes a `movieId` as a parameter.
// 2. Finds the index of the movie in the watchlist array.
// 3. Removes it from the watchlist using the .splice() method.
// 4. Returns true if removed, or false if the movie was not in the watchlist.
function removeFromWatchlist(movieId) {
  // Your code here
}
