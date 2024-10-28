const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");

puppeteer.use(StealthPlugin());

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";

async function loginToFedEx(username, password) {
  console.log("launching browser");

  const browser = await puppeteer.launch({
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
  const page = await browser.newPage();

  // Set a random or default user agent
  //   const userAgent = randomUseragent.getRandom() || USER_AGENT;
  //   await page.setUserAgent(userAgent);

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

  // Navigate to FedEx login page
  await page.goto("https://www.fedex.com/secure-login/#/credentials", {
    waitUntil: "networkidle2", // Ensures that the page has fully loaded
    timeout: 0,
  });
  await page.screenshot({ path: "credential.png" });

  // Wait for the username field to be available
  await page.waitForSelector("#username");
  await page.waitForSelector("#password");
  await page.waitForSelector("#login_button");

  // Input the username and password
  await page.type("#username", username, { delay: 100 }); // Simulate human typing with a small delay
  await page.type("#password", password, { delay: 100 });

  // Click the login button
  await page.click("#login_button");

  // Wait for navigation after logging in
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  console.log("Login attempt finished");

  // Optionally, take a screenshot after login
  await page.screenshot({ path: "logged_in_fedex.png" });

  // Navigate to the invoices page
  console.log("Navigating to invoices page...");
  await page.goto("https://www.fedex.com/online/billing/cbs/invoices");

  // Take a screenshot of the invoices page
  await page.screenshot({ path: "invoices_page.png" });
  console.log("Screenshot of invoices page taken");
  await page.waitForSelector(".invoice-table-data", { timeout: 0 }); // Ensure the element is loaded
  // Extract clean data from the invoice table
  const invoiceData = await page.$$eval("tr.fdx-c-table__tbody__tr", (rows) => {
    return Array.from(rows).map((row) => {
      const payerAccountNumber =
        row.querySelector('td[data-label="payerAccountNumber"] span')
          ?.innerText || "";
      const invoiceNumber =
        row.querySelector('td[data-label="invoiceNumber"] button')?.innerText ||
        "";
      const invoiceDueDate =
        row.querySelector('td[data-label="invoiceDueDateStr"] span')
          ?.innerText || "";
      const invoiceDate =
        row.querySelector('td[data-label="invoiceDateStr"] span')?.innerText ||
        "";
      const invoiceStatus =
        row.querySelector('td[data-label="invoiceStatus"] span')?.innerText ||
        "";
      const invoiceType =
        row.querySelector('td[data-label="invoiceType"] span')?.innerText || "";
      const originalAmount =
        row.querySelector('td[data-label="originalAmountStr"] span')
          ?.innerText || "";
      const currentBalance =
        row.querySelector('td[data-label="currentBalanceStr"] span')
          ?.innerText || "";
      const currency =
        row.querySelector('td[data-label="currency"] span')?.innerText || "";
     

      return {
        payerAccountNumber,
        invoiceNumber,
        invoiceDueDate,
        invoiceDate,
        invoiceStatus,
        invoiceType,
        originalAmount,
        currentBalance,
        currency,
      };
    });
  });


  console.log("Extracted Invoice Data:", invoiceData);

  // Optionally, save the data to a JSON file or database here

  // Close the browser after the task is completed
  await browser.close();
}

// Call the function with your login credentials
loginToFedEx("akil9889", "Pa55word").then(() => {
  console.log("Login process completed.");
});
