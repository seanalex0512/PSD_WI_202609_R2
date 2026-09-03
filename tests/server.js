// ============================================
// Live Test UI Server
// Watches q1-q3 files and pushes results via SSE
// Run with: npm run dev
// DO NOT MODIFY THIS FILE
// ============================================

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const PORT = 3001;
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "..");

const WATCH_FILES = [
  "q1-watchlist-setup.js",
  "q2-search-filter.js",
  "q3-display.js",
];

// -- Run tests via subprocess --------------------------------
function runTests() {
  try {
    const result = execSync("node test-runner.js", {
      encoding: "utf8",
      timeout: 15000,
      cwd: DIR,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result.trim();
  } catch (e) {
    const msg = (e.stderr ?? e.message ?? "Unknown error")
      .replace(/\x1b\[[0-9;]*m/g, "")
      .trim();
    return JSON.stringify([
      {
        question: "Error",
        title: "Runtime Error",
        tests: [{ name: msg.slice(0, 500), passed: false, error: msg.slice(0, 500) }],
      },
    ]);
  }
}

// -- SSE client management -----------------------------------
const clients = new Set();

function broadcast(data) {
  for (const client of clients) {
    client.write(`data: ${data}\n\n`);
  }
}

// -- File watcher with debounce ------------------------------
let debounceTimer = null;

function onFileChange(filename) {
  if (filename && !WATCH_FILES.includes(filename)) return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`File changed: ${filename ?? "unknown"} — re-running tests...`);
    const results = runTests();
    broadcast(results);
  }, 400);
}

fs.watch(ROOT, { recursive: false }, (_event, filename) => {
  onFileChange(filename);
});

// -- HTML for the UI -----------------------------------------
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Movie Watchlist — Test Results</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    min-height: 100vh;
    padding: 2rem 1rem;
  }

  .container { max-width: 720px; margin: 0 auto; }

  .header { text-align: center; margin-bottom: 2.5rem; }
  .header h1 { font-size: 1.5rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.25rem; }
  .header p { font-size: 0.875rem; color: #94a3b8; }

  .score-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
  .score-ring { position: relative; width: 140px; height: 140px; }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring .bg { fill: none; stroke: #1e293b; stroke-width: 10; }
  .score-ring .fg {
    fill: none; stroke-width: 10; stroke-linecap: round;
    transition: stroke-dashoffset 0.6s ease, stroke 0.3s ease;
  }
  .score-label {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .score-num { font-size: 2.25rem; font-weight: 800; line-height: 1; }
  .score-total { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
  .status-badge {
    margin-top: 0.75rem; padding: 0.25rem 1rem; border-radius: 999px;
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .status-badge.all-pass { background: #064e3b; color: #6ee7b7; }
  .status-badge.some-fail { background: #7f1d1d; color: #fca5a5; }
  .status-badge.waiting { background: #1e293b; color: #94a3b8; }

  .card {
    background: #1e293b; border-radius: 12px; padding: 1.25rem 1.5rem;
    margin-bottom: 1rem; border: 1px solid #334155;
    transition: border-color 0.3s ease;
  }
  .card.all-pass { border-color: #065f46; }
  .card.has-fail { border-color: #991b1b; }

  .card-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.75rem;
  }
  .card-title { font-size: 1rem; font-weight: 700; }
  .card-tag {
    font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.6rem;
    border-radius: 999px; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .card-tag.pass { background: #064e3b; color: #6ee7b7; }
  .card-tag.fail { background: #7f1d1d; color: #fca5a5; }

  .test-item {
    display: flex; align-items: flex-start; gap: 0.6rem;
    padding: 0.4rem 0; font-size: 0.85rem;
  }
  .test-icon { flex-shrink: 0; width: 20px; text-align: center; font-weight: 700; }
  .test-icon.pass { color: #34d399; }
  .test-icon.fail { color: #f87171; }
  .test-name { color: #cbd5e1; }
  .test-error {
    font-size: 0.75rem; color: #f87171; margin-top: 0.15rem;
    font-family: 'JetBrains Mono', monospace; white-space: pre-wrap; word-break: break-all;
  }

  .live-bar {
    position: fixed; top: 0; left: 0; right: 0; height: 3px;
    background: transparent; z-index: 100;
    transition: background 0.3s ease;
  }
  .live-bar.connected { background: #22c55e; }
  .live-bar.disconnected { background: #ef4444; }
  .live-bar.updating {
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%);
    background-size: 200% 100%;
    animation: shimmer 1s ease infinite;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .footer { text-align: center; margin-top: 2rem; font-size: 0.75rem; color: #475569; }

  .fade-in { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
</head>
<body>
<div class="live-bar" id="liveBar"></div>
<div class="container">
  <div class="header">
    <h1>Movie Watchlist</h1>
    <p>Problem Solving Week &mdash; Individual Challenge</p>
  </div>

  <div class="score-section">
    <div class="score-ring">
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle class="bg" cx="70" cy="70" r="58" />
        <circle class="fg" id="scoreFg" cx="70" cy="70" r="58"
          stroke-dasharray="364.42" stroke-dashoffset="364.42" />
      </svg>
      <div class="score-label">
        <span class="score-num" id="scoreNum">-</span>
        <span class="score-total" id="scoreTotal">/ -</span>
      </div>
    </div>
    <div class="status-badge waiting" id="statusBadge">Waiting...</div>
  </div>

  <div id="results"></div>

  <div class="footer">
    Save any q1&ndash;q3 file to re-run tests automatically.
  </div>
</div>

<script>
const CIRC = 2 * Math.PI * 58;

function render(data) {
  let passed = 0, total = 0;
  data.forEach(q => q.tests.forEach(t => { total++; if (t.passed) passed++; }));

  const pct = total > 0 ? passed / total : 0;
  document.getElementById('scoreFg').style.strokeDashoffset = CIRC * (1 - pct);
  document.getElementById('scoreFg').style.stroke = pct === 1 ? '#22c55e' : pct > 0.5 ? '#eab308' : '#ef4444';
  document.getElementById('scoreNum').textContent = passed;
  document.getElementById('scoreTotal').textContent = '/ ' + total;

  const badge = document.getElementById('statusBadge');
  if (total === 0) {
    badge.className = 'status-badge waiting';
    badge.textContent = 'No tests';
  } else if (passed === total) {
    badge.className = 'status-badge all-pass';
    badge.textContent = 'All Passed';
  } else {
    badge.className = 'status-badge some-fail';
    badge.textContent = passed + ' of ' + total + ' passed';
  }

  const container = document.getElementById('results');
  container.innerHTML = '';
  data.forEach(q => {
    const qPassed = q.tests.filter(t => t.passed).length;
    const qTotal = q.tests.length;
    const allPass = qPassed === qTotal;

    const card = document.createElement('div');
    card.className = 'card fade-in ' + (allPass ? 'all-pass' : 'has-fail');

    let testsHtml = '';
    q.tests.forEach(t => {
      testsHtml += '<div class="test-item">';
      testsHtml += '<span class="test-icon ' + (t.passed ? 'pass' : 'fail') + '">' + (t.passed ? '\\u2713' : '\\u2717') + '</span>';
      testsHtml += '<div><div class="test-name">' + escHtml(t.name) + '</div>';
      if (t.error) testsHtml += '<div class="test-error">' + escHtml(t.error) + '</div>';
      testsHtml += '</div></div>';
    });

    card.innerHTML =
      '<div class="card-header">' +
        '<span class="card-title">' + escHtml(q.question) + ': ' + escHtml(q.title) + '</span>' +
        '<span class="card-tag ' + (allPass ? 'pass' : 'fail') + '">' + qPassed + '/' + qTotal + '</span>' +
      '</div>' + testsHtml;

    container.appendChild(card);
  });
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function connect() {
  const bar = document.getElementById('liveBar');
  const es = new EventSource('/events');

  es.onopen = () => { bar.className = 'live-bar connected'; setTimeout(() => bar.className = 'live-bar', 2000); };
  es.onmessage = (e) => {
    bar.className = 'live-bar updating';
    try { render(JSON.parse(e.data)); } catch {}
    setTimeout(() => bar.className = 'live-bar connected', 600);
    setTimeout(() => bar.className = 'live-bar', 2600);
  };
  es.onerror = () => {
    bar.className = 'live-bar disconnected';
    es.close();
    setTimeout(connect, 3000);
  };
}
connect();
</script>
</body>
</html>`;

// -- HTTP Server ---------------------------------------------
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(HTML);
    return;
  }

  if (req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    clients.add(res);

    const initial = runTests();
    res.write(`data: ${initial}\n\n`);

    req.on("close", () => clients.delete(res));
    return;
  }

  if (req.url === "/api/results") {
    const data = runTests();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n  Movie Watchlist Test UI running at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  console.log("  Watching q1-q3 files for changes...\n");
});
