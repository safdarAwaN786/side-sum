const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
let browser;

module.exports = {
  launchScrapingBrowser: async () => {
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
      ],
    });
    console.log("scraping browser launched");
  },

  loginToFedex: async (username, password) => {
    const page = await browser.newPage();

    // Randomize viewport size
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 1080 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);
    console.log("Starting login...");

    // Navigate to FedEx login page
    await page.goto("https://www.fedex.com/secure-login/#/credentials", {
      waitUntil: "networkidle2", // Ensures that the page has fully loaded
      timeout: 0,
    });

    // Wait for the username, password fields, and login button to be available
    await page.waitForSelector("#username", { timeout: 0 });
    await page.waitForSelector("#password", { timeout: 0 });
    await page.waitForSelector("#login_button", { timeout: 0 });
    console.log("typing credentials");

    // Input the username and password
    await page.type("#username", username, { delay: 100 }); // Simulate human typing with a small delay
    await page.type("#password", password, { delay: 100 });

    // Click the login button
    await page.click("#login_button");
    console.log("waiting for navigation");

    // Wait for navigation after logging in
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Login attempt finished");

    // Check if the user is redirected to the logged-in home page
    if (page.url() === "https://www.fedex.com/en-us/logged-in-home.html") {
      console.log("Logged in successfully");
      await page.close(); // Close the page after successful login
      return {
        accVerified: true,
      };
    }

    // Check for error messages or unexpected redirects
    const errorMessageSelector = "#retry-btn"; // Replace with the actual selector for login error message
    const errorMessageExists = await page.$(errorMessageSelector);

    if (errorMessageExists) {
      console.log("Login failed: Invalid credentials");
      await page.close();
      return {
        accVerified: false,
      };
    }

    // Optionally handle unexpected navigation (e.g., a different page)
    console.log("Unexpected page after login:", page.url());
    await page.close(); // Close the page in this case as well
    return {
      accVerified: false,
    };
  },
};
