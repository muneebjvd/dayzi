const https = require('https');

function fetchFollow(url, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
      }
    }, (res) => {
      console.log('Status:', res.statusCode, 'Location:', res.headers.location || '');
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) loc = 'https://www.walmart.com' + loc;
        res.destroy();
        return fetchFollow(loc, redirects + 1).then(resolve).catch(reject);
      }
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => resolve({ status: res.statusCode, html: d }));
    }).on('error', reject).end();
  });
}

(async () => {
  const { status, html } = await fetchFollow('https://www.walmart.com/search?q=dove+body+wash+deep+moisture');
  console.log('Final status:', status, 'HTML length:', html.length);
  
  const p1 = html.match(/property="og:image"\s+content="([^"]+)"/);
  const p2 = html.match(/content="([^"]+)"\s+property="og:image"/);
  const p3 = html.match(/"og:image","content":"([^"\\]+)"/);
  const p4 = html.match(/i5\.walmartimages\.com\/seo\/[^"' ]{20,}/);
  
  console.log('P1:', p1 ? p1[1].substring(0, 150) : 'NO');
  console.log('P2:', p2 ? p2[1].substring(0, 150) : 'NO');
  console.log('P3:', p3 ? p3[1].substring(0, 150) : 'NO');
  console.log('P4:', p4 ? p4[0].substring(0, 150) : 'NO');
  
  const idx = html.indexOf('og:image');
  if (idx > -1) {
    console.log('OG:IMAGE Snippet:', html.substring(Math.max(0, idx-5), idx + 300));
  } else {
    console.log('No og:image found in HTML');
    // show first 500 chars
    console.log('HTML start:', html.substring(0, 500));
  }
})();
