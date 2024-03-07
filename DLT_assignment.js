const https = require('https');
const url = 'https://time.com';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const htmlContent = data;

    // Regular expression pattern to match <li> elements with class "latest-stories__item"
    const pattern = /<li\s+class="[^"]*latest-stories__item[^"]*">(.*?)<\/li>/gs;

    // Use the match() method to find all matches
    const matches = htmlContent.match(pattern);

    if (matches) {
      // Loop through the matches and extract the desired data
      const latestStories = matches.map(match => {
        const liContent = match.replace(/<\/?li[^>]*>/g, ''); // Remove <li> and </li> tags
        return liContent.trim(); // Return the trimmed content inside the <li> element
      });

      const jsonData = latestStories.map(item => {
        const hrefMatch = item.match(/<a href="(.*?)"/);
        const link = hrefMatch ? "https://time.com" + hrefMatch[1] : '';
        const titleMatch = item.match(/<h3 class="latest-stories__item-headline">(.*?)<\/h3>/);
        const title = titleMatch ? titleMatch[1] : '';
        return { title, link };
      });

      const http = require('http');
      const hostname = 'localhost';
      const port = 3000;

      const server = http.createServer((req, res) => {
        if (req.url === '/getTimeStories' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(jsonData));
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not found');
        }
      });

      server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/getTimeStories`);
      });
    } else {
      console.log('No entries found with class "latest-stories__item"');
    }
  });
}).on('error', (err) => {
  console.error('Error:', err);
});