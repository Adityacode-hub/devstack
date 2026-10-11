require("dotenv").config();

const app = require("./app");

const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});