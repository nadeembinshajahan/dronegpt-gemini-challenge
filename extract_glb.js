const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const glbUrls = [];
  
  // Intercept network requests to find GLB
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.glb') || url.includes('mesh') || url.includes('asset')) {
      glbUrls.push(url);
    }
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('.glb')) {
      console.log('GLB_FOUND:', url);
    }
  });

  try {
    await page.goto('https://marble.worldlabs.ai/world/f850e33b-50bb-4a61-b361-46376404ea47', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit more for async loading
    await page.waitForTimeout(5000);
    
    console.log('All intercepted URLs with assets:');
    glbUrls.forEach(u => console.log(u));
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
