const fs = require('fs');
const content = fs.readFileSync('d:/Personal/Private/Kitty/dayzi/src/data/products.ts', 'utf-8');

// Match all category and subcategory pairs
const regex = /category:\s*"([^"]+)",[\s\S]*?subcategory:\s*"([^"]+)"/g;
let match;
const cats = {};

while ((match = regex.exec(content)) !== null) {
  const cat = match[1];
  const sub = match[2];
  if (!cats[cat]) cats[cat] = new Set();
  cats[cat].add(sub);
}

for (const c in cats) {
  console.log(`\nCategory: ${c}`);
  console.log(Array.from(cats[c]).join(', '));
}
