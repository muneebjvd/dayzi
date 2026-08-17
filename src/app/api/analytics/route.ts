import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "analytics-data.json");

export interface PageView {
  path: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  ip: string;
}

function readData(): PageView[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // corrupted file — start fresh
  }
  return [];
}

function writeData(data: PageView[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// POST — record a page view
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pageView: PageView = {
      path: body.path || "/",
      timestamp: new Date().toISOString(),
      referrer: body.referrer || "",
      userAgent: req.headers.get("user-agent") || "",
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown",
    };

    const data = readData();
    data.push(pageView);
    writeData(data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}

// GET — return analytics data (optionally filtered)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

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

  // Aggregate stats
  const totalViews = data.length;

  // Views by date
  const byDate: Record<string, number> = {};
  data.forEach((d) => {
    const date = d.timestamp.split("T")[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  // Views by page
  const byPage: Record<string, number> = {};
  data.forEach((d) => {
    byPage[d.path] = (byPage[d.path] || 0) + 1;
  });

  // Views by hour (for today)
  const today = new Date().toISOString().split("T")[0];
  const todayViews = data.filter((d) => d.timestamp.startsWith(today));
  const byHour: Record<string, number> = {};
  for (let h = 0; h < 24; h++) {
    const key = h.toString().padStart(2, "0");
    byHour[key] = 0;
  }
  todayViews.forEach((d) => {
    const hour = new Date(d.timestamp).getHours().toString().padStart(2, "0");
    byHour[hour] = (byHour[hour] || 0) + 1;
  });

  // Device breakdown (simple UA parsing)
  let mobile = 0,
    desktop = 0,
    tablet = 0;
  data.forEach((d) => {
    const ua = d.userAgent.toLowerCase();
    if (ua.includes("tablet") || ua.includes("ipad")) tablet++;
    else if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    )
      mobile++;
    else desktop++;
  });

  // Referrer breakdown
  const byReferrer: Record<string, number> = {};
  data.forEach((d) => {
    const ref = d.referrer || "Direct";
    let source = "Direct";
    if (ref !== "Direct") {
      try {
        source = new URL(ref).hostname;
      } catch {
        source = ref;
      }
    }
    byReferrer[source] = (byReferrer[source] || 0) + 1;
  });

  // Unique visitors (by IP)
  const uniqueIPs = new Set(data.map((d) => d.ip));

  // Live: views in last 5 minutes
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const liveCount = data.filter((d) => new Date(d.timestamp) >= fiveMinAgo).length;

  // Today's total
  const todayTotal = todayViews.length;

  return NextResponse.json({
    totalViews,
    todayTotal,
    liveCount,
    uniqueVisitors: uniqueIPs.size,
    byDate,
    byPage,
    byHour,
    byReferrer,
    devices: { mobile, desktop, tablet },
    recentViews: data.slice(-50).reverse(),
  });
}
