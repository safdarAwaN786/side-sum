const express = require("express");
const http = require("http");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");
const server = http.createServer(app);
const testRoute = require('./routes/test')
const connectDb = require('./config/db')

app.use(cors());
app.use(express.json());

app.use(testRoute)


server.listen(5005, () => {
  try {
    console.log(`Server is running at port ${5005}`);
  } catch (error) {
    console.log("Server Error");
  }
});
