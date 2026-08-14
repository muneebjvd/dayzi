// Script to download real product images from public sources
// Run with: node scripts/download-images.mjs

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const OUTPUT_DIR = path.join(process.cwd(), "public", "products");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Map of product slug -> array of image URLs to try (in order)
// These are direct CDN image URLs sourced from brand websites and public CDNs
const imageMap = {
  "dove-body-wash":
    "https://www.dove.com/content/dam/dove/us/en/body-wash/610x610_dove_original_body_wash.jpg",
  "philosophy-bath-shower-gel":
    "https://www.philosophy.com/dw/image/v2/BBFP_PRD/on/demandware.static/-/Sites-philosophy-master-catalog/default/dw8b28c5e6/images/large/00012156.jpg",
  "dove-shea-butter-vanilla-body-wash":
    "https://www.dove.com/content/dam/dove/us/en/body-wash/610x610_dove_shea_butter_warm_vanilla_body_wash.jpg",
  "dove-purely-pampering-cream-body-wash":
    "https://www.dove.com/content/dam/dove/us/en/body-wash/610x610_dove_purely_pampering_shea_butter_body_wash.jpg",
  "method-body-wash-pure-peace":
    "https://methodproducts.com/cdn/shop/files/Pure-Peace-Body-Wash.jpg",
  "dove-beauty-bar-soap":
    "https://www.dove.com/content/dam/dove/us/en/bar/610x610_dove_beauty_bar_original.jpg",
  "olay-super-serum-body-wash":
    "https://olay.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-OlayCORP-master/default/dw9adf4ee0/img/2023/Q3/Olay_SuperSerum_BodyWash_ExtraDrySkin.jpg",
};

// Helper to download a file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    proto
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          downloadFile(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", reject);
  });
}

// Main
(async () => {
  for (const [slug, url] of Object.entries(imageMap)) {
    const ext = url.split(".").pop()?.split("?")[0] || "jpg";
    const dest = path.join(OUTPUT_DIR, `${slug}.${ext}`);

    if (fs.existsSync(dest)) {
      console.log(`✓ Already exists: ${slug}`);
      continue;
    }

    try {
      console.log(`⬇ Downloading ${slug}...`);
      await downloadFile(url, dest);
      console.log(`✓ Saved: ${slug}.${ext}`);
    } catch (err) {
      console.error(`✗ Failed ${slug}: ${err.message}`);
      // Remove partial file
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
    }
  }
  console.log("Done!");
})();
