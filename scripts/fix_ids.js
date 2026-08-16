const fs=require('fs');
let p=fs.readFileSync('d:/Personal/Private/Kitty/dayzi/src/data/products.ts','utf8');
let count=1;
p=p.replace(/id: "[^"]+"/g, () => `id: "p-${count++}"`);
fs.writeFileSync('d:/Personal/Private/Kitty/dayzi/src/data/products.ts', p);
console.log('Fixed all IDs.');
