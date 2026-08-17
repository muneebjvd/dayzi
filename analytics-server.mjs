/**
 * Dayzi Analytics Dashboard Server
 * Run: node analytics-server.mjs
 * Opens a beautiful live dashboard on http://localhost:8000
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "analytics-data.json");
const PORT = 8000;

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // corrupted file
  }
  return [];
}

function getAnalytics(from, to) {
  let data = readData();

  if (from) {
    const fromDate = new Date(from);
    data = data.filter((d) => new Date(d.timestamp) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    data = data.filter((d) => new Date(d.timestamp) <= toDate);
  }

  const totalViews = data.length;

  // Views by date
  const byDate = {};
  data.forEach((d) => {
    const date = d.timestamp.split("T")[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  // Views by page
  const byPage = {};
  data.forEach((d) => {
    byPage[d.path] = (byPage[d.path] || 0) + 1;
  });

  // Views by hour (today)
  const today = new Date().toISOString().split("T")[0];
  const todayViews = data.filter((d) => d.timestamp.startsWith(today));
  const byHour = {};
  for (let h = 0; h < 24; h++) {
    byHour[h.toString().padStart(2, "0")] = 0;
  }
  todayViews.forEach((d) => {
    const hour = new Date(d.timestamp).getHours().toString().padStart(2, "0");
    byHour[hour] = (byHour[hour] || 0) + 1;
  });

  // Devices
  let mobile = 0,
    desktop = 0,
    tablet = 0;
  data.forEach((d) => {
    const ua = (d.userAgent || "").toLowerCase();
    if (ua.includes("tablet") || ua.includes("ipad")) tablet++;
    else if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) mobile++;
    else desktop++;
  });

  // Referrer breakdown
  const byReferrer = {};
  data.forEach((d) => {
    const ref = d.referrer || "Direct";
    let source = "Direct";
    if (ref !== "Direct" && ref !== "") {
      try {
        source = new URL(ref).hostname;
      } catch {
        source = ref;
      }
    }
    byReferrer[source] = (byReferrer[source] || 0) + 1;
  });

  // Unique visitors
  const uniqueIPs = new Set(data.map((d) => d.ip));

  // Live (last 5 min)
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const liveCount = data.filter((d) => new Date(d.timestamp) >= fiveMinAgo).length;

  // Today total
  const todayTotal = todayViews.length;

  return {
    totalViews,
    todayTotal,
    liveCount,
    uniqueVisitors: uniqueIPs.size,
    byDate,
    byPage,
    byHour,
    byReferrer,
    devices: { mobile, desktop, tablet },
    recentViews: data.slice(-100).reverse(),
  };
}

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dayzi Analytics — Live Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg-primary: #0a0a0f;
      --bg-secondary: #12121a;
      --bg-card: #1a1a28;
      --bg-card-hover: #222236;
      --border: #2a2a3e;
      --border-glow: rgba(139, 92, 246, 0.3);
      --text-primary: #f0f0f5;
      --text-secondary: #8888a0;
      --text-muted: #5a5a72;
      --accent: #8b5cf6;
      --accent-glow: rgba(139, 92, 246, 0.15);
      --pink: #ec4899;
      --pink-glow: rgba(236, 72, 153, 0.15);
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.15);
      --amber: #f59e0b;
      --amber-glow: rgba(245, 158, 11, 0.15);
      --blue: #3b82f6;
      --blue-glow: rgba(59, 130, 246, 0.15);
      --red: #ef4444;
      --cyan: #06b6d4;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Background gradient orbs */
    body::before {
      content: '';
      position: fixed;
      top: -200px;
      right: -200px;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    body::after {
      content: '';
      position: fixed;
      bottom: -200px;
      left: -200px;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .dashboard { max-width: 1400px; margin: 0 auto; padding: 24px 28px 48px; position: relative; z-index: 1; }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .logo {
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--accent) 0%, var(--pink) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }
    .logo-sub {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 400;
    }
    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--emerald);
      background: var(--emerald-glow);
      border: 1px solid rgba(16,185,129,0.2);
      padding: 6px 14px;
      border-radius: 100px;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald);
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 0 0 8px rgba(16,185,129,0.5);
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    .last-updated { font-size: 12px; color: var(--text-muted); }

    /* Stats grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      border-color: var(--border-glow);
      background: var(--bg-card-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      border-radius: 16px 16px 0 0;
    }
    .stat-card:nth-child(1)::before { background: linear-gradient(90deg, var(--accent), transparent); }
    .stat-card:nth-child(2)::before { background: linear-gradient(90deg, var(--pink), transparent); }
    .stat-card:nth-child(3)::before { background: linear-gradient(90deg, var(--emerald), transparent); }
    .stat-card:nth-child(4)::before { background: linear-gradient(90deg, var(--amber), transparent); }
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 14px;
    }
    .stat-card:nth-child(1) .stat-icon { background: var(--accent-glow); }
    .stat-card:nth-child(2) .stat-icon { background: var(--pink-glow); }
    .stat-card:nth-child(3) .stat-icon { background: var(--emerald-glow); }
    .stat-card:nth-child(4) .stat-icon { background: var(--amber-glow); }
    .stat-value {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-card:nth-child(1) .stat-value { color: var(--accent); }
    .stat-card:nth-child(2) .stat-value { color: var(--pink); }
    .stat-card:nth-child(3) .stat-value { color: var(--emerald); }
    .stat-card:nth-child(4) .stat-value { color: var(--amber); }
    .stat-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }

    /* Charts area */
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    @media (max-width: 900px) {
      .charts-grid { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
    }
    .card:hover {
      border-color: var(--border-glow);
      box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title-icon {
      font-size: 16px;
    }

    /* Bar chart */
    .chart-container { width: 100%; }
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 180px;
      padding-top: 8px;
    }
    .bar-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      height: 100%;
      justify-content: flex-end;
    }
    .bar {
      width: 100%;
      max-width: 40px;
      border-radius: 6px 6px 2px 2px;
      background: linear-gradient(180deg, var(--accent) 0%, rgba(139,92,246,0.4) 100%);
      transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      min-height: 2px;
      position: relative;
      cursor: pointer;
    }
    .bar:hover {
      background: linear-gradient(180deg, var(--pink) 0%, var(--accent) 100%);
      box-shadow: 0 0 20px rgba(139,92,246,0.3);
      transform: scaleY(1.02);
    }
    .bar-tooltip {
      display: none;
      position: absolute;
      top: -32px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg-primary);
      border: 1px solid var(--border);
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .bar:hover .bar-tooltip { display: block; }
    .bar-label {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Hour chart (mini) */
    .hour-chart {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 100px;
    }
    .hour-bar-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      height: 100%;
      justify-content: flex-end;
    }
    .hour-bar {
      width: 100%;
      border-radius: 3px 3px 1px 1px;
      background: linear-gradient(180deg, var(--pink) 0%, rgba(236,72,153,0.3) 100%);
      min-height: 1px;
      transition: all 0.4s ease;
      cursor: pointer;
      position: relative;
    }
    .hour-bar:hover {
      background: linear-gradient(180deg, var(--accent) 0%, var(--pink) 100%);
      box-shadow: 0 0 12px rgba(236,72,153,0.3);
    }
    .hour-label { font-size: 8px; color: var(--text-muted); }

    /* Pages list */
    .page-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
    .page-list::-webkit-scrollbar { width: 4px; }
    .page-list::-webkit-scrollbar-track { background: transparent; }
    .page-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    .page-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 10px;
      background: rgba(255,255,255,0.02);
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .page-row:hover {
      background: rgba(139,92,246,0.05);
      border-color: rgba(139,92,246,0.15);
    }
    .page-path {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      font-family: 'SF Mono', 'Fira Code', monospace;
    }
    .page-count {
      font-size: 14px;
      font-weight: 700;
      color: var(--accent);
      min-width: 40px;
      text-align: right;
    }
    .page-bar-bg {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: 10px;
      background: var(--accent-glow);
      z-index: -1;
      transition: width 0.5s ease;
    }

    /* Device donut */
    .device-list { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
    .device-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .device-color {
      width: 12px;
      height: 12px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .device-label { font-size: 13px; color: var(--text-secondary); flex: 1; }
    .device-count { font-size: 14px; font-weight: 700; }
    .device-bar {
      height: 6px;
      border-radius: 3px;
      background: var(--bg-primary);
      width: 100%;
      margin-top: 4px;
      overflow: hidden;
    }
    .device-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    /* Referrer list */
    .ref-list { display: flex; flex-direction: column; gap: 8px; }
    .ref-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(255,255,255,0.02);
    }
    .ref-icon { font-size: 14px; }
    .ref-name { font-size: 13px; color: var(--text-secondary); flex: 1; }
    .ref-count { font-size: 13px; font-weight: 600; color: var(--text-primary); }

    /* Recent activity */
    .activity-list { display: flex; flex-direction: column; gap: 6px; max-height: 350px; overflow-y: auto; }
    .activity-list::-webkit-scrollbar { width: 4px; }
    .activity-list::-webkit-scrollbar-track { background: transparent; }
    .activity-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    .activity-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      background: rgba(255,255,255,0.015);
      transition: all 0.2s ease;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-8px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .activity-row:hover { background: rgba(255,255,255,0.04); }
    .activity-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .activity-path { font-size: 13px; font-weight: 500; color: var(--text-primary); flex: 1; }
    .activity-time { font-size: 11px; color: var(--text-muted); white-space: nowrap; }
    .activity-device {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 100px;
      background: rgba(255,255,255,0.05);
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* Bottom grid */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    @media (max-width: 900px) {
      .bottom-grid { grid-template-columns: 1fr; }
    }

    /* Date traffic grid */
    .date-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    @media (max-width: 900px) {
      .date-grid { grid-template-columns: 1fr; }
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
    .empty-text { font-size: 15px; color: var(--text-secondary); margin-bottom: 4px; }
    .empty-sub { font-size: 13px; color: var(--text-muted); }

    /* Refresh controls */
    .controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .refresh-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--bg-card);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .refresh-btn:hover {
      border-color: var(--accent);
      background: var(--accent-glow);
      box-shadow: 0 0 16px rgba(139,92,246,0.15);
    }
    .refresh-btn.spinning .btn-icon { animation: spin 0.8s linear; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Date calendar table */
    .date-table { width: 100%; border-collapse: separate; border-spacing: 0 4px; }
    .date-table th {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 12px;
    }
    .date-table td {
      padding: 10px 12px;
      font-size: 13px;
    }
    .date-table tr td:first-child { border-radius: 8px 0 0 8px; }
    .date-table tr td:last-child { border-radius: 0 8px 8px 0; }
    .date-table tbody tr {
      background: rgba(255,255,255,0.02);
      transition: all 0.2s ease;
    }
    .date-table tbody tr:hover { background: rgba(139,92,246,0.05); }
    .date-val { font-weight: 600; color: var(--text-primary); }
    .date-views { font-weight: 700; color: var(--accent); }
    .date-bar-cell { width: 40%; }
    .date-bar-track {
      height: 6px;
      border-radius: 3px;
      background: rgba(255,255,255,0.05);
      overflow: hidden;
    }
    .date-bar-fill {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, var(--accent), var(--pink));
      transition: width 0.5s ease;
    }

    /* Scrollbar for the whole page */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-primary); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  </style>
</head>
<body>
  <div class="dashboard" id="dashboard">
    <div class="header">
      <div class="header-left">
        <div>
          <div class="logo">✦ Dayzi Analytics</div>
          <div class="logo-sub">Live website traffic dashboard</div>
        </div>
      </div>
      <div class="controls">
        <div class="live-badge">
          <div class="live-dot"></div>
          <span>LIVE</span>
          <span id="liveCount">0</span>
        </div>
        <button class="refresh-btn" onclick="refresh()" id="refreshBtn">
          <span class="btn-icon">↻</span> Refresh
        </button>
        <div class="last-updated">Updated: <span id="lastUpdated">—</span></div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-value" id="totalViews">0</div>
        <div class="stat-label">Total Page Views</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-value" id="todayViews">0</div>
        <div class="stat-label">Today's Views</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-value" id="liveViewers">0</div>
        <div class="stat-label">Live (Last 5 min)</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value" id="uniqueVisitors">0</div>
        <div class="stat-label">Unique Visitors</div>
      </div>
    </div>

    <!-- Daily Traffic Chart + Hourly -->
    <div class="charts-grid">
      <div class="card">
        <div class="card-title"><span class="card-title-icon">📈</span> Daily Traffic (Last 14 Days)</div>
        <div class="chart-container">
          <div class="bar-chart" id="dailyChart"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title"><span class="card-title-icon">🕐</span> Today by Hour</div>
        <div class="chart-container">
          <div class="hour-chart" id="hourChart"></div>
        </div>
      </div>
    </div>

    <!-- Date Table + Top Pages -->
    <div class="date-grid">
      <div class="card">
        <div class="card-title"><span class="card-title-icon">📅</span> Traffic by Date</div>
        <div style="max-height: 350px; overflow-y: auto;">
          <table class="date-table" id="dateTable">
            <thead><tr><th>Date</th><th>Views</th><th>Distribution</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-title"><span class="card-title-icon">📄</span> Top Pages</div>
        <div class="page-list" id="pageList"></div>
      </div>
    </div>

    <!-- Devices + Referrers + Recent Activity -->
    <div class="bottom-grid">
      <div class="card">
        <div class="card-title"><span class="card-title-icon">📱</span> Devices</div>
        <div class="device-list" id="deviceList"></div>
      </div>
      <div class="card">
        <div class="card-title"><span class="card-title-icon">🔗</span> Traffic Sources</div>
        <div class="ref-list" id="refList"></div>
      </div>
      <div class="card">
        <div class="card-title"><span class="card-title-icon">🕑</span> Recent Activity</div>
        <div class="activity-list" id="activityList"></div>
      </div>
    </div>
  </div>

  <script>
    const API_URL = '/api/analytics';
    let autoRefreshInterval;

    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        return await res.json();
      } catch (err) {
        console.error('Fetch error:', err);
        return null;
      }
    }

    function animateValue(el, target) {
      const current = parseInt(el.textContent) || 0;
      if (current === target) return;
      const diff = target - current;
      const steps = 20;
      const stepVal = diff / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        if (step >= steps) {
          el.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          el.textContent = Math.round(current + stepVal * step).toLocaleString();
        }
      }, 25);
    }

    function formatTime(iso) {
      const d = new Date(iso);
      const now = new Date();
      const diff = now - d;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
      if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatDate(dateStr) {
      const d = new Date(dateStr + 'T00:00:00');
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (dateStr === today) return 'Today';
      if (dateStr === yesterday) return 'Yesterday';
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    function getDeviceIcon(ua) {
      ua = (ua || '').toLowerCase();
      if (ua.includes('tablet') || ua.includes('ipad')) return '📱';
      if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return '📱';
      return '💻';
    }

    function getDeviceLabel(ua) {
      ua = (ua || '').toLowerCase();
      if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
      if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'Mobile';
      return 'Desktop';
    }

    function renderDailyChart(byDate) {
      const container = document.getElementById('dailyChart');
      const entries = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);

      if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-sub">No data yet</div></div>';
        return;
      }

      const max = Math.max(...entries.map(e => e[1]), 1);
      container.innerHTML = entries.map(([date, count]) => {
        const height = Math.max((count / max) * 160, 3);
        const label = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return \`
          <div class="bar-wrapper">
            <div class="bar" style="height: \${height}px">
              <div class="bar-tooltip">\${count} views</div>
            </div>
            <div class="bar-label">\${label}</div>
          </div>
        \`;
      }).join('');
    }

    function renderHourChart(byHour) {
      const container = document.getElementById('hourChart');
      const entries = Object.entries(byHour).sort((a, b) => a[0].localeCompare(b[0]));
      const max = Math.max(...entries.map(e => e[1]), 1);

      container.innerHTML = entries.map(([hour, count]) => {
        const height = Math.max((count / max) * 80, 1);
        const show = parseInt(hour) % 3 === 0;
        return \`
          <div class="hour-bar-wrapper">
            <div class="hour-bar" style="height: \${height}px" title="\${hour}:00 — \${count} views"></div>
            \${show ? '<div class="hour-label">' + hour + '</div>' : ''}
          </div>
        \`;
      }).join('');
    }

    function renderDateTable(byDate) {
      const tbody = document.querySelector('#dateTable tbody');
      const entries = Object.entries(byDate).sort((a, b) => b[0].localeCompare(a[0]));
      const max = Math.max(...entries.map(e => e[1]), 1);

      if (entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3"><div class="empty-state"><div class="empty-icon">📅</div><div class="empty-sub">No traffic recorded yet</div></div></td></tr>';
        return;
      }

      tbody.innerHTML = entries.map(([date, count]) => \`
        <tr>
          <td><span class="date-val">\${formatDate(date)}</span></td>
          <td><span class="date-views">\${count}</span></td>
          <td class="date-bar-cell">
            <div class="date-bar-track">
              <div class="date-bar-fill" style="width: \${(count / max) * 100}%"></div>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function renderPages(byPage) {
      const container = document.getElementById('pageList');
      const entries = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 20);
      const max = Math.max(...entries.map(e => e[1]), 1);

      if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📄</div><div class="empty-sub">No pages tracked yet</div></div>';
        return;
      }

      container.innerHTML = entries.map(([pagePath, count]) => \`
        <div class="page-row" style="position: relative; overflow: hidden;">
          <div class="page-bar-bg" style="width: \${(count / max) * 100}%"></div>
          <span class="page-path">\${pagePath}</span>
          <span class="page-count">\${count}</span>
        </div>
      \`).join('');
    }

    function renderDevices(devices) {
      const container = document.getElementById('deviceList');
      const total = devices.desktop + devices.mobile + devices.tablet || 1;
      const items = [
        { label: 'Desktop', count: devices.desktop, color: 'var(--accent)', icon: '💻' },
        { label: 'Mobile', count: devices.mobile, color: 'var(--pink)', icon: '📱' },
        { label: 'Tablet', count: devices.tablet, color: 'var(--amber)', icon: '📱' },
      ];

      container.innerHTML = items.map(item => \`
        <div>
          <div class="device-row">
            <div class="device-color" style="background: \${item.color}"></div>
            <span class="device-label">\${item.icon} \${item.label}</span>
            <span class="device-count" style="color: \${item.color}">\${item.count}</span>
          </div>
          <div class="device-bar">
            <div class="device-bar-fill" style="width: \${(item.count / total) * 100}%; background: \${item.color};"></div>
          </div>
        </div>
      \`).join('');
    }

    function renderReferrers(byReferrer) {
      const container = document.getElementById('refList');
      const entries = Object.entries(byReferrer).sort((a, b) => b[1] - a[1]).slice(0, 10);

      if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔗</div><div class="empty-sub">No referrers yet</div></div>';
        return;
      }

      container.innerHTML = entries.map(([source, count]) => {
        const icon = source === 'Direct' ? '🏠' :
                     source.includes('google') ? '🔍' :
                     source.includes('instagram') ? '📸' :
                     source.includes('tiktok') ? '🎵' :
                     source.includes('youtube') ? '▶️' :
                     source.includes('facebook') ? '👤' :
                     source.includes('twitter') || source.includes('x.com') ? '🐦' : '🌐';
        return \`
          <div class="ref-row">
            <span class="ref-icon">\${icon}</span>
            <span class="ref-name">\${source}</span>
            <span class="ref-count">\${count}</span>
          </div>
        \`;
      }).join('');
    }

    function renderActivity(recentViews) {
      const container = document.getElementById('activityList');

      if (!recentViews || recentViews.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🕑</div><div class="empty-sub">No activity yet</div></div>';
        return;
      }

      const colors = ['var(--accent)', 'var(--pink)', 'var(--emerald)', 'var(--amber)', 'var(--blue)', 'var(--cyan)'];
      container.innerHTML = recentViews.slice(0, 30).map((view, i) => \`
        <div class="activity-row">
          <div class="activity-dot" style="background: \${colors[i % colors.length]}"></div>
          <span class="activity-path">\${view.path}</span>
          <span class="activity-device">\${getDeviceLabel(view.userAgent)}</span>
          <span class="activity-time">\${formatTime(view.timestamp)}</span>
        </div>
      \`).join('');
    }

    async function refresh() {
      const btn = document.getElementById('refreshBtn');
      btn.classList.add('spinning');
      setTimeout(() => btn.classList.remove('spinning'), 800);

      const data = await fetchData();
      if (!data) return;

      // Animate stat cards
      animateValue(document.getElementById('totalViews'), data.totalViews);
      animateValue(document.getElementById('todayViews'), data.todayTotal);
      animateValue(document.getElementById('liveViewers'), data.liveCount);
      animateValue(document.getElementById('uniqueVisitors'), data.uniqueVisitors);
      document.getElementById('liveCount').textContent = data.liveCount;

      // Render charts
      renderDailyChart(data.byDate);
      renderHourChart(data.byHour);
      renderDateTable(data.byDate);
      renderPages(data.byPage);
      renderDevices(data.devices);
      renderReferrers(data.byReferrer);
      renderActivity(data.recentViews);

      // Update timestamp
      document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
    }

    // Initial load + auto-refresh every 10 seconds
    refresh();
    autoRefreshInterval = setInterval(refresh, 10000);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API endpoint
  if (url.pathname === "/api/analytics") {
    const analytics = getAnalytics(url.searchParams.get("from"), url.searchParams.get("to"));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(analytics));
    return;
  }

  // Dashboard
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(DASHBOARD_HTML);
});

server.listen(PORT, () => {
  console.log("");
  console.log("  ✦ Dayzi Analytics Dashboard");
  console.log(`  🌐 http://localhost:${PORT}`);
  console.log("  📊 Auto-refreshes every 10 seconds");
  console.log("  ⏹  Press Ctrl+C to stop");
  console.log("");
});
