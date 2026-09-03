// ============================================
// Test Runner — outputs JSON to stdout
// Used by the web UI server to get results
// DO NOT MODIFY THIS FILE
// ============================================

import { runAllTests } from './test-cases.js';

const results = runAllTests();
process.stdout.write(JSON.stringify(results));
