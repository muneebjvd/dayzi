const fs=require('fs');
const p=fs.readFileSync('src/data/products.ts','utf8');
const ids=p.match(/id: .*/g).map(i=>i.split('"')[1]);
console.log([...new Set(ids.filter((e,i,a)=>a.indexOf(e)!==i))]);
