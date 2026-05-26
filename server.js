const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const COINS_FILE = path.join(__dirname, "coins.json");

// crear coins.json si no existe
if (!fs.existsSync(COINS_FILE)) {
  fs.writeFileSync(COINS_FILE, "{}");
}

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer(function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // GET /coins — devuelve coins.json
  if (req.method === "GET" && req.url === "/coins") {
    const data = fs.readFileSync(COINS_FILE, "utf8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
    return;
  }

  // PUT /coins — sobreescribe coins.json
  if (req.method === "PUT" && req.url === "/coins") {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk;
    });
    req.on("end", function () {
      try {
        JSON.parse(body); // validar que es JSON válido
        fs.writeFileSync(COINS_FILE, body);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(body);
      } catch (e) {
        res.writeHead(400);
        res.end("JSON inválido");
      }
    });
    return;
  }

  // servir archivos estáticos
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(PORT, function () {
  console.log("Fuente corriendo en http://localhost:" + PORT);
});
