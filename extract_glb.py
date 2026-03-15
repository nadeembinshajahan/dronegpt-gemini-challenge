from playwright.sync_api import sync_playwright
import re

glb_urls = []

def capture_request(request):
    url = request.url
    if '.glb' in url or 'mesh' in url.lower():
        glb_urls.append(url)
        print(f"FOUND: {url}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("request", capture_request)
    
    try:
        page.goto('https://marble.worldlabs.ai/world/f850e33b-50bb-4a61-b361-46376404ea47', 
                  wait_until='networkidle', timeout=30000)
        page.wait_for_timeout(5000)
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n--- All GLB URLs found ---")
    for url in glb_urls:
        print(url)
    
    browser.close()
