const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const logs = [];
  const networkErrors = [];
  
  page.on('console', msg => logs.push(`[Console ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', error => logs.push(`[Page Error] ${error.message}`));
  page.on('requestfailed', request => {
    networkErrors.push(`[Failed Request] ${request.url()} - ${request.failure().errorText}`);
  });
  page.on('response', response => {
    if (!response.ok()) {
      networkErrors.push(`[Bad Response] ${response.url()} - Status: ${response.status()}`);
    }
  });

  try {
    console.log("Navigating to http://localhost:3000/login...");
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    
    // Wait a brief moment for hydration to settle
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    console.log("\n--- BROWSER EVIDENCE ---");
    console.log("\n1. Console & Exceptions:");
    if (logs.length === 0) console.log("No console errors or hydration warnings.");
    else logs.forEach(log => console.log(log));
    
    console.log("\n2. Network & Failed Chunks:");
    if (networkErrors.length === 0) console.log("No failed requests or bad responses.");
    else networkErrors.forEach(err => console.log(err));
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("\n3. Current Rendered Text:");
    console.log(bodyText.substring(0, 200).replace(/\n/g, ' '));
    
  } catch (err) {
    console.error("Script Error:", err);
  } finally {
    await browser.close();
  }
})();
