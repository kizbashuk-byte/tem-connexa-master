const jsdom = require('jsdom');
const { JSDOM } = jsdom;

(async () => {
  console.log("Fetching HTML from localhost:3000/login...");
  
  JSDOM.fromURL("http://localhost:3000/login", {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  }).then(dom => {
    console.log("JSDOM initialized.");
    const window = dom.window;

    ['log', 'warn', 'error', 'info'].forEach(method => {
      window.console[method] = (...args) => {
        console.log(`[Console ${method.toUpperCase()}]:`, ...args);
      };
    });

    window.addEventListener('error', event => {
      console.log("[Page Error]:", event.error || event.message);
    });

    setTimeout(() => {
      console.log("\n--- DOM After Hydration ---");
      const html = dom.window.document.body.innerHTML;
      if (html.includes("404") || html.includes("could not be found")) {
        console.log("Result: Rendered a 404 page.");
      } else if (html.includes("Connexa")) {
        console.log("Result: Rendered the Login page.");
      } else {
        console.log("Result: Unknown output.");
        console.log(html.substring(0, 300));
      }
      process.exit(0);
    }, 5000);
  }).catch(err => {
    console.error("JSDOM Error:", err);
  });
})();
