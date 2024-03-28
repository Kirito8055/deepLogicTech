const https = require("https");
const http = require("http");
const url = "https://time.com";
const port = 3000;
const hostname = "localhost";

let jsonData = [];
let htmlContent = "";

// a function for extracting string data from startTag to endTag
function scrapper(startTag, endTag, htmlContent) {
  const startIndex = htmlContent.indexOf(startTag);
  htmlContent = htmlContent.substring(startIndex);
  const endIndex = htmlContent.indexOf(endTag);
  htmlContent = htmlContent.substring(0, endIndex);
  return htmlContent;
}

// a function for extracting first title and link from allNews string
function titleLinkExtractor(allNews) {
  const news1 = scrapper("<a href=", "</a>", allNews);
  const link = url + scrapper('"/', '/"', news1).substring(1);
  const index = news1.indexOf('<h3 class="');
  const title = scrapper('">', "</h3>", news1.substring(index)).substring(2);
  allNews = allNews.substring(5);
  const endingIndex = allNews.indexOf("<time class=");
  jsonData.push({ title, link });
  return allNews.substring(endingIndex);
}

// to get the {title,link} format from the website
https.get(url, (res) => {
    res.on("data", (chunk) => {
      htmlContent += chunk;
    });
    res.on("end", () => {
      let allNews = scrapper('<li class="latest-stories__item">',"</ul>",htmlContent);
      for (let i = 0; i < 6; i++) allNews = titleLinkExtractor(allNews);
    });
  })
  .on("error", (err) => {
    console.error("Error:", err);
  });

// to host the API
const app = http.createServer((req, res) => {
  if (req.url === "/getTimeStories" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(jsonData));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/getTimeStories`);
});
