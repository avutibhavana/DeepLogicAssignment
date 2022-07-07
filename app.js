const https = require("https");
const http = require("http");
const url = "https://time.com/";

let data = "";
let array = [];
async function fetch() {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        response.on("data", (info) => {
          data += info;
        });

        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
async function getData() {
  try {
    const data = await fetch();
    const pattern =
      /(<li)\s+(class="latest-stories__item">)\s+(<a)\s+(href="\/)([0-9]+\/).*\s+(<h3)\s+(class="latest-stories__item-headline">).*\s+(<\/a>)/gm;

    let result = data.match(pattern);

    for (i = 0; i <= 5; i++) {
      let content = /(\/[0-9]+\/).*"/gm;
      let part = result[i].match(content);
      let url = part[0];

      url = url.slice(0, url.length - 1);

      let content1 = /(>[a-zA-Z0-9]+).*</gm;
      let heading1 = result[i].match(content1);
      let head = heading1[0];
      head = head.slice(1, head.length - 1);
      const obj = { title: head, link: "https://time.com" + url };
      array.push(obj);
    }
  } catch (error) {
    console.log("following error occured while fetching:", error);
  }
}
getData();
const server = http.createServer((req, res) => {
  if (req.url === "/getTimeStories" && req.method === "GET") {
    res.end(JSON.stringify(array));
  }
});

server.listen(5200, () => {
  console.log("server is listening at port 5200");
});
