const express = require("express");
const request = require("request");
const quesryString = require("query-string");
const app = express();
app.use(express.static("public"))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

const handleRequest = (req, res, baseUrl) => {
  request(
    { url: `${baseUrl}?${quesryString.stringify(req.query)}` },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log(req.headers)
        return res
          .status(500)
          .json({ type: "error", message: "Internal server error!" });
      }

      res.json(JSON.parse(body));
    }
  );
};
app.get("/accessToken", (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/accessToken`;
  handleRequest(req, res, url);
});
app.get("/profile", (req, res) => {
  const url = `https://api.linkedin.com/v2/me`;
  handleRequest(req, res, url);
});
app.get("/email", (req, res) => {
  const url = `https://api.linkedin.com/v2/emailAddress`;
  handleRequest(req, res, url);
});
app.listen(process.env.PORT || 3000);
