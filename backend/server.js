const express = require("express");
const http = require("http");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const server = http.createServer(app);
const accAddRoutes = require("./routes/addAccountsRoutes");
const accConnectRoutes = require("./routes/connectAccounts");
const authRoutes = require("./routes/authRoutes");
const connectDb = require("./config/db");
const { launchScrapingBrowser } = require("./utils/connections");

app.use(cors());
app.use(express.json());

app.use("/addAccount", accAddRoutes);
app.use("/connect", accConnectRoutes);
app.use("/auth", authRoutes);

launchScrapingBrowser();
server.listen(5005, () => {
  try {
    console.log(`Server is running at port ${5005}`);
  } catch (error) {
    console.log("Server Error");
  }
});
