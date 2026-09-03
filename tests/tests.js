// ============================================
// CLI Test Runner — prints results to terminal
// Run with: npm run test
// DO NOT MODIFY THIS FILE
// ============================================

import { runAllTests } from './test-cases.js';

console.log("Running Movie Watchlist Tests...\n");

const results = runAllTests();

let totalPassed = 0;
let totalFailed = 0;
const failures = [];

for (const question of results) {
  console.log(`--- ${question.question}: ${question.title} ---`);
  for (const t of question.tests) {
    if (t.passed) {
      console.log(`  \u2713 ${t.name}`);
      totalPassed++;
    } else {
      console.log(`  \u2717 ${t.name}`);
      if (t.error) console.log(`    ${t.error}`);
      failures.push(`${question.question} > ${t.name}${t.error ? `: ${t.error}` : ""}`);
      totalFailed++;
    }
  }
  console.log();
}

const total = totalPassed + totalFailed;
console.log("========================================");
if (totalFailed === 0) {
  console.log("All tests passed! \u2713");
} else {
  console.log(`Tests: ${totalPassed}/${total} passed, ${totalFailed} failed`);
  console.log("\nFailed:");
  failures.forEach((f) => console.log(`  - ${f}`));
}
console.log("========================================");

if (totalFailed > 0) process.exit(1);
