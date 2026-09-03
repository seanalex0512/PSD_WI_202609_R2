// ============================================
// Shared Test Definitions
// Used by both the CLI runner and the web UI
// DO NOT MODIFY THIS FILE
// ============================================

import { movies, watchlist, addToWatchlist, removeFromWatchlist } from '../q1-watchlist-setup.js';
import { searchByTitle, filterByGenre, getTopRated } from '../q2-search-filter.js';
import { getWatchlistCount, getAverageRating, displayWatchlist } from '../q3-display.js';

function test(name, fn) {
  try {
    const passed = fn();
    return { name, passed: !!passed };
  } catch (e) {
    return { name, passed: false, error: e.message || String(e) };
  }
}

function resetWatchlist() {
  watchlist.length = 0;
}

function runAllTests() {
  return [
    // -- Q1: Watchlist Setup (4 tests) --------------------------
    {
      question: "Q1",
      title: "Watchlist Setup",
      tests: [
        test("movies array has 5 objects with id, title, genre, year, rating", () => {
          return (
            Array.isArray(movies) &&
            movies.length === 5 &&
            movies.every(
              (m) =>
                typeof m.id === "number" &&
                typeof m.title === "string" &&
                typeof m.genre === "string" &&
                typeof m.year === "number" &&
                typeof m.rating === "number"
            )
          );
        }),

        test("watchlist starts as an empty array", () => {
          resetWatchlist();
          return Array.isArray(watchlist) && watchlist.length === 0;
        }),

        test("addToWatchlist adds a valid movie, rejects invalid ID and duplicates", () => {
          resetWatchlist();
          const firstMovie = movies[0];
          const result = addToWatchlist(firstMovie.id);
          const invalidResult = addToWatchlist(999);
          const dupResult = addToWatchlist(firstMovie.id);
          return (
            result === true &&
            invalidResult === false &&
            dupResult === false &&
            watchlist.length === 1 &&
            watchlist[0].id === firstMovie.id
          );
        }),

        test("removeFromWatchlist removes a movie and returns correct booleans", () => {
          resetWatchlist();
          const first = movies[0];
          const second = movies[1];
          addToWatchlist(first.id);
          addToWatchlist(second.id);
          const removed = removeFromWatchlist(first.id);
          const notFound = removeFromWatchlist(999);
          return (
            removed === true &&
            notFound === false &&
            watchlist.length === 1 &&
            watchlist[0].id === second.id
          );
        }),
      ],
    },

    // -- Q2: Search & Filter (3 tests) --------------------------
    {
      question: "Q2",
      title: "Search & Filter",
      tests: [
        test("searchByTitle returns matching movies case-insensitively", () => {
          const firstTitle = movies[0].title;
          const keyword = firstTitle.slice(0, 3);
          const results = searchByTitle(keyword);
          const upperResults = searchByTitle(keyword.toUpperCase());
          const noResults = searchByTitle("zzzzzxxx");
          return (
            Array.isArray(results) &&
            results.length > 0 &&
            results.every((m) => m.title.toLowerCase().includes(keyword.toLowerCase())) &&
            upperResults.length === results.length &&
            Array.isArray(noResults) &&
            noResults.length === 0
          );
        }),

        test("filterByGenre returns correct movies for a genre", () => {
          const targetGenre = movies[0].genre;
          const expected = movies.filter(
            (m) => m.genre.toLowerCase() === targetGenre.toLowerCase()
          );
          const results = filterByGenre(targetGenre);
          const lowerResults = filterByGenre(targetGenre.toLowerCase());
          const none = filterByGenre("zzzNoGenre");
          return (
            Array.isArray(results) &&
            results.length === expected.length &&
            results.every((m) => m.genre.toLowerCase() === targetGenre.toLowerCase()) &&
            lowerResults.length === expected.length &&
            Array.isArray(none) &&
            none.length === 0
          );
        }),

        test("getTopRated returns movies sorted by rating descending", () => {
          const top3 = getTopRated(3);
          const all = getTopRated(100);
          return (
            Array.isArray(top3) &&
            top3.length === 3 &&
            top3[0].rating >= top3[1].rating &&
            top3[1].rating >= top3[2].rating &&
            Array.isArray(all) &&
            all.length === movies.length
          );
        }),
      ],
    },

    // -- Q3: Display Functions (3 tests) -------------------------
    {
      question: "Q3",
      title: "Display Functions",
      tests: [
        test("getWatchlistCount returns the correct count", () => {
          resetWatchlist();
          const empty = getWatchlistCount();
          addToWatchlist(movies[0].id);
          addToWatchlist(movies[1].id);
          const two = getWatchlistCount();
          return empty === 0 && two === 2;
        }),

        test("getAverageRating calculates the correct average", () => {
          const avg = getAverageRating([
            { rating: 9.0 },
            { rating: 8.0 },
            { rating: 7.0 },
          ]);
          const emptyAvg = getAverageRating([]);
          return avg === 8.0 && emptyAvg === 0;
        }),

        test("displayWatchlist prints correct format", () => {
          resetWatchlist();
          const logs = [];
          const origLog = console.log;
          try {
            console.log = (...args) => logs.push(args.join(" "));

            displayWatchlist();
            const emptyMsg = logs.length === 1 && logs[0] === "Your watchlist is empty.";

            logs.length = 0;
            const m1 = movies[0];
            const m2 = movies[1];
            addToWatchlist(m1.id);
            addToWatchlist(m2.id);
            displayWatchlist();

            const avgVal = Math.round(((m1.rating + m2.rating) / 2) * 10) / 10;

            return (
              emptyMsg &&
              logs.length === 4 &&
              logs[0] === "My Watchlist:" &&
              logs[1] === `- ${m1.title} (${m1.year}) \u2014 ${m1.rating}/10` &&
              logs[2] === `- ${m2.title} (${m2.year}) \u2014 ${m2.rating}/10` &&
              logs[3] === `Average Rating: ${avgVal}/10`
            );
          } finally {
            console.log = origLog;
          }
        }),
      ],
    },
  ];
}

export { runAllTests };
