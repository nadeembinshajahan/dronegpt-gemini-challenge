from playwright.sync_api import sync_playwright
import json

all_urls = []

def capture_response(response):
    url = response.url
    ct = response.headers.get('content-type', '')
    # Capture any binary or json responses that might contain mesh data
    if '.glb' in url or 'mesh' in url or 'world' in url or 'asset' in url:
        print(f"RESP: {url[:100]} [{ct}]")
        all_urls.append(url)
    # Also look for JSON that might contain URLs
    if 'application/json' in ct and 'world' in url:
        try:
            data = response.json()
            print(f"JSON: {json.dumps(data)[:500]}")
        except:
            pass

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("response", capture_response)
    
    try:
        # Just load without waiting for networkidle
        page.goto('https://marble.worldlabs.ai/world/f850e33b-50bb-4a61-b361-46376404ea47', timeout=15000)
        page.wait_for_timeout(10000)  # Wait for dynamic loading
    except Exception as e:
        print(f"Nav done or timeout: {e}")
    
    # Also try to extract from page scripts
    scripts = page.evaluate('''() => {
        const data = [];
        // Look for any global state with mesh URLs
        if (window.__NUXT__) data.push(JSON.stringify(window.__NUXT__));
        if (window.__NEXT_DATA__) data.push(JSON.stringify(window.__NEXT_DATA__));
        // Search all script tags
        document.querySelectorAll('script').forEach(s => {
            if (s.textContent.includes('glb') || s.textContent.includes('mesh')) {
                data.push(s.textContent.substring(0, 500));
            }
        });
        return data;
    }''')
    print("\n--- Scripts with mesh refs ---")
    for s in scripts:
        print(s[:300])
    
    browser.close()
