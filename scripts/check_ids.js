const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf-8');
const ids = [...content.matchAll(/id: "(bc-\d+)"/g)].map(m => m[1]);
console.log('Body care IDs:', ids.join(', '));
