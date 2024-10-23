const { chromium } = require('playwright');

// This controller is used to connect/login to fedex account, it requires userId and password of fedex account in req body
const connectFedex = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (userId && password) {
        const browser = await chromium.launch({ headless: true });

      const page = await browser.newPage();

    //   // Set a custom User-Agent
    //   await page.setUserAgent(
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
    //   );

      // Navigate to FedEx login page
      const response = await page.goto(
        "https://www.fedex.com/secure-login/en-us/#/credentials"
      );
      console.log("Response Status:", response.status());
      console.log(page.url());
      const pageContent = await page.content(); // Get the full HTML content
      console.log("Page Content Snippet:", pageContent); // Log first 500 characters

      // Wait for login form to load and fill in the credentials
        await page.waitForSelector("#username");
        await page.type("#username", userId);
        await page.type("#password", password);

        // Submit the login form
        await Promise.all([
          page.click("#login_button"), // Adjust selector for login button
        //   page.waitForNavigation({ waitUntil: "networkidle0" }), // Wait for page to fully load
        ]);
        // Check if the user was redirected to the dashboard
        // const dashboardSelector = ""; // Replace with the actual selector for an element on the dashboard
        const errorMessageSelector = "#retry-btn"; // Replace with actual selector for login error message

        // Check if the dashboard is present
        // const dashboardExists = await page.$(dashboardSelector);
        const errorMessageExists = await page.$(errorMessageSelector);

        if (errorMessageExists) {
          // Login failed, return error response
          console.log("Login failed: Invalid credentials");
          await browser.close();
          return res.status(401).json({
            message: "Invalid userId or password. Please try again.",
          });
        }

        // if (!dashboardExists) {
          // Handle case where neither the dashboard nor an error message is found
        //   console.log("Unexpected page after login attempt.");
        //   await browser.close();
        //   return res.status(500).json({
        //     message: "An unexpected error occurred. Please try again later.",
        //   });
        // }

        // If the dashboard is present, navigate to account information page (update URL as needed)
        // await page.goto("https://www.fedex.com/account-info-url"); // Replace with actual account info page URL

        // // Wait for account info page to load and locate the account number
        // await page.waitForSelector(".account-number-selector"); // Replace with actual CSS selector for account number

        // // Scrape the account number
        // const accountNumber = await page.$eval(
        //   ".account-number-selector",
        //   (el) => el.innerText
        // );
        // console.log("User Account Number:", accountNumber);
        console.log('logged In successfully');
        

      //   Close the browser
      await browser.close();
      res.status(200).json(req.body);
    } else {
      res.status(203).json({
        message: "Please provide userId and password in request body",
      });
    }
  } catch (error) {
    console.log("Error while connecting fedex", error);
  }
};

module.exports = { connectFedex };
