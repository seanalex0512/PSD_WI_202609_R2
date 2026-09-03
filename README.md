# JavaScript Movie Watchlist Challenge

**Difficulty:** Beginner
**Time Limit:** 40 minutes
**Individual**

---

## Problem Statement

Build a **Movie Watchlist** system in JavaScript. You will create your own movie database, manage a personal watchlist using arrays, search and filter movies, and display formatted results.

This exercise tests your understanding of:

1. Array manipulation (`push`, `splice`)
2. Searching arrays (`find`, `findIndex`, `filter`)
3. Sorting and slicing arrays
4. Functions and parameters
5. Basic loops and arithmetic

---

## Project Structure

| File / Folder | Description |
|---------------|-------------|
| [q1-watchlist-setup.js](q1-watchlist-setup.js) | Create the movies array, watchlist, add/remove functions |
| [q2-search-filter.js](q2-search-filter.js) | Search by title, filter by genre, get top rated |
| [q3-display.js](q3-display.js) | Count, average rating, display functions |
| `tests/` | Test runner, test cases, and live server **(do not modify)** |

---

## Getting Started

### Prerequisites

- Node.js >= 18

### Setup

1. Start the live test UI:
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3001](http://localhost:3001) in your browser.

2. Edit the `q1`-`q3` files in your editor. Every time you save, the web UI updates automatically.

### Alternative: CLI Testing

```bash
npm run test
```

---

## Scoring

The assignment is graded out of **10 marks**. Each successful test case is worth **1 mark**.

| # | Topic | Tests |
|---|-------|-------|
| Q1 | Watchlist Setup | 4 |
| Q2 | Search & Filter | 3 |
| Q3 | Display Functions | 3 |
| **Total** | | **10** |

The live UI at [http://localhost:3001](http://localhost:3001) shows your progress in real time.

---

## Questions Overview

### Question 1: Watchlist Setup _(4 tests)_
In [q1-watchlist-setup.js](q1-watchlist-setup.js):
- Create a `movies` array with 5 movie objects (each with `id`, `title`, `genre`, `year`, `rating`)
- Create an empty `watchlist` array
- Implement `addToWatchlist(movieId)` — find and add a movie, prevent duplicates
- Implement `removeFromWatchlist(movieId)` — find and remove using `.splice()`

### Question 2: Search & Filter _(3 tests)_
In [q2-search-filter.js](q2-search-filter.js):
- Implement `searchByTitle(keyword)` — case-insensitive title search
- Implement `filterByGenre(genre)` — filter movies by genre
- Implement `getTopRated(count)` — return top N movies by rating

### Question 3: Display Functions _(3 tests)_
In [q3-display.js](q3-display.js):
- Implement `getWatchlistCount()` — return number of items
- Implement `getAverageRating(moviesArray)` — calculate average rating
- Implement `displayWatchlist()` — print formatted watchlist to console

---

Good luck!
