#!/usr/bin/env node
// node scripts/get-images.mjs
// Downloads real product images from Walmart CDN

import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "..", "public", "products");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { "User-Agent": UA }, timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (e) => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
  });
}

async function getWalmartImage(query) {
  const url = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
  try {
    const html = await fetchText(url);
    // Try multiple OG image patterns
    const patterns = [
      /property="og:image"\s+content="([^"]+)"/,
      /content="([^"]+)"\s+property="og:image"/,
      /"og:image","content":"([^"\\]+)"/,
      /i5\.walmartimages\.com\/seo\/[^"'\s]+\.jpeg[^"'\s]*/,
    ];
    for (const pat of patterns) {
      const m = html.match(pat);
      if (m) {
        let imgUrl = m[1] || m[0];
        imgUrl = imgUrl.replace(/&amp;/g, "&");
        // Upscale
        imgUrl = imgUrl.replace(/odnHeight=\d+/, "odnHeight=600").replace(/odnWidth=\d+/, "odnWidth=600");
        if (!imgUrl.startsWith("http")) imgUrl = "https://" + imgUrl;
        return imgUrl;
      }
    }
  } catch (e) {
    console.error(`  Request error: ${e.message}`);
  }
  return null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const products = {
  "dove-body-wash": "Dove Deep Moisture Body Wash",
  "philosophy-bath-shower-gel": "Philosophy Amazing Grace Bath Shower Gel",
  "dove-shea-butter-vanilla-body-wash": "Dove Shea Butter Warm Vanilla Body Wash",
  "dove-purely-pampering-cream-body-wash": "Dove Purely Pampering Cream Body Wash shea",
  "method-body-wash-pure-peace": "Method Body Wash Pure Peace peony rose",
  "dove-beauty-bar-soap": "Dove Beauty Bar Soap Original",
  "olay-super-serum-body-wash": "Olay Super Serum Body Wash Extra Dry Skin",
  "glycolic-acid-exfoliating-toner": "Glycolic Acid 7 percent Exfoliating Toner",
  "dove-pomegranate-shea-butter-scrub": "Dove Pomegranate Shea Butter Body Scrub",
  "tree-hut-body-scrub": "Tree Hut Shea Sugar Body Scrub",
  "premium-exfoliating-mitt": "Exfoliating Mitt Body Scrub Bath",
  "korean-exfoliating-glove": "Korean Exfoliating Gloves Italy Towel",
  "silicone-bath-shampoo-brush": "Silicone Body Scrubber Brush Back",
  "dry-body-brush-natural-bristles": "Dry Brushing Body Brush Natural Bristles",
  "shower-brush-long-handle": "Shower Back Brush Long Handle",
  "eos-shea-butter-shave-cream": "eos Shea Better Shave Cream",
  "gillette-venus-comfortglide-razor": "Gillette Venus ComfortGlide Womens Razor",
  "eos-moisturizer": "eos Shea Body Lotion 24-Hour Moisturizer",
  "nivea-cocoa-butter-body-cream": "NIVEA Cocoa Butter Body Cream",
  "victorias-secret-body-lotion": "Victoria Secret Body Lotion",
  "johnsons-baby-lotion": "Johnsons Baby Lotion",
  "johnsons-baby-oil": "Johnsons Baby Oil Mineral",
  "sol-de-janeiro-cheirosa-59": "Sol de Janeiro Cheirosa 59 Body Mist",
  "sol-de-janeiro-cheirosa-68": "Sol de Janeiro Cheirosa 68 Body Mist Spray",
  "sol-de-janeiro-cheirosa-62": "Sol de Janeiro Cheirosa 62 Body Mist",
  "eos-cashmere-body-mist": "eos Cashmere Vanilla Body Spray Mist",
  "ariana-grande-mod-vanilla-perfume": "Ariana Grande MOD Vanilla Eau de Parfum",
  "billie-eilish-eau-de-parfum": "Billie Eilish Eau de Parfum Perfume",
  "dove-advanced-care-deodorant-spray": "Dove Advanced Care Antiperspirant Deodorant Spray",
  "ice-roller-face-eye": "Ice Roller for Face Eye Skincare",
  "garnier-micellar-facial-cleanser": "Garnier Micellar Cleansing Water Makeup Remover",
  "neutrogena-makeup-remover-towelettes": "Neutrogena Makeup Remover Wipes Pink Grapefruit",
  "byoma-creamy-jelly-cleanser": "BYOMA Creamy Jelly Cleanser",
  "cerave-air-foam-face-wash": "CeraVe Hydrating Facial Cleanser Air Foam Face Wash",
  "honest-beauty-gentle-gel-cleanser": "Honest Beauty Gentle Gel Daily Face Cleanser",
  "skin1004-water-fit-sun-serum": "SKIN1004 Hyalu-Cica Water-Fit Sun Serum SPF 50",
  "relief-sun-organic-korean-sunscreen": "Korean Sunscreen SPF 50 lightweight reef safe",
  "the-ordinary-salicylic-acid-solution": "The Ordinary Salicylic Acid 2 Solution",
  "glow-recipe-pha-bha-face-toner": "Glow Recipe Watermelon Glow PHA BHA Toner",
  "elf-skin-holy-hydration-peeling-exfoliant": "elf Skin Holy Hydration Gentle Peeling Exfoliant",
  "biodance-bio-collagen-deep-mask": "BIODANCE Bio-Collagen Real Deep Mask Hydrating",
  "cosrx-snail-mucin-sheet-mask": "COSRX Snail Mucin Sheet Mask",
  "innisfree-cherry-blossom-glow-jelly-cream": "Innisfree Cherry Blossom Glow Jelly Cream",
  "fresh-lotus-youth-preserve-dream-cream": "Fresh Lotus Youth Preserve Dream Cream",
  "bio-oil-skincare-body-oil-serum": "Bio Oil Skincare Body Oil Scars Stretch Marks",
  "the-ordinary-multi-peptide-eye-serum": "The Ordinary Multi-Peptide Eye Serum",
  "laneige-lip-sleeping-mask": "LANEIGE Lip Sleeping Mask",
  "summer-fridays-lip-butter-balm": "Summer Fridays Lip Butter Balm Moisturizing",
  "amoado-sugar-lip-scrub": "Sugar Lip Scrub Dark Lips",
  "vaseline-lip-therapy": "Vaseline Lip Therapy Original",
  "ouai-leave-in-conditioner": "OUAI Multitasking Leave In Conditioner",
  "olaplex-no5-leave-in-conditioner": "Olaplex No 5 Leave In Conditioner",
  "mielle-rosemary-mint-hair-oil": "Mielle Organics Rosemary Mint Scalp Hair Oil Biotin",
  "olaplex-no7-bonding-hair-oil": "Olaplex No 7 Bonding Oil",
  "ouai-hair-oil-bundle": "OUAI Hair Oil",
  "self-grip-hair-rollers": "Self Grip Hair Rollers Set",
  "cat-shape-hair-head-massager": "Cat Shape Scalp Massager Comb Wooden",
  "scalp-scrubber-silicone-bristles": "Scalp Scrubber Silicone Bristles Shampoo Brush",
  "vent-hairbrush-for-women": "Vent Hairbrush Women Detangling",
  "frizz-control-blowout-hair-dryer-brush": "Hot Air Brush Hair Dryer Blowout Styler",
  "gainwell-bamboo-hair-brush": "Bamboo Hair Brush Natural Bristle Growth",
  "monday-haircare-volume-shampoo-conditioner": "MONDAY HAIRCARE Volume Shampoo Conditioner",
  "conditioner-fragrance-free-hydrating-scalp": "Fragrance Free Hydrating Conditioner Scalp Care",
  "garnier-honey-treasures-repairing-shampoo": "Garnier Whole Blends Honey Treasures Repairing Shampoo",
  "garnier-fructis-pure-clean-shampoo": "Garnier Fructis Pure Clean Purifying Shampoo",
  "garnier-fructis-sleek-shine-shampoo-conditioner": "Garnier Fructis Sleek Shine Shampoo Argan",
  "garnier-fructis-curl-nourish-shampoo-conditioner": "Garnier Fructis Curl Nourish Moisturizing Shampoo",
  "loreal-elvive-glycolic-gloss-shampoo": "LOreal Paris Elvive Glycolic Gloss Shampoo",
};

(async () => {
  let success = 0, failed = 0, skipped = 0;
  const entries = Object.entries(products);
  console.log(`Downloading images for ${entries.length} products...\n`);

  for (let i = 0; i < entries.length; i++) {
    const [slug, query] = entries[i];
    const dest = path.join(OUTPUT_DIR, `${slug}.jpg`);

    if (fs.existsSync(dest)) {
      const size = fs.statSync(dest).size;
      if (size > 2000) {
        console.log(`[${i+1}/${entries.length}] SKIP: ${slug}`);
        skipped++;
        continue;
      }
      fs.unlinkSync(dest);
    }

    process.stdout.write(`[${i+1}/${entries.length}] Fetching: ${slug}... `);
    const imgUrl = await getWalmartImage(query);

    if (!imgUrl) {
      console.log(`FAIL (no URL)`);
      failed++;
      await sleep(500);
      continue;
    }

    try {
      await downloadFile(imgUrl, dest);
      const size = fs.statSync(dest).size;
      console.log(`OK (${Math.round(size/1024)}KB)`);
      success++;
    } catch (e) {
      console.log(`FAIL (${e.message})`);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      failed++;
    }

    await sleep(700);
  }

  console.log(`\nDone: ${success} success, ${skipped} skipped, ${failed} failed.`);
})();
