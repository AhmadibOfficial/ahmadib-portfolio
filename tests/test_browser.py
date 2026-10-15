from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]/'publication'

class BrowserTests(unittest.TestCase):
    def test_search_responsiveness(self):
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            self.skipTest('Playwright not installed; covered by separate local acceptance test')
        markup=(ROOT/'index.html').read_text().replace('</head>','<style>'+(ROOT/'assets/style.css').read_text()+'</style></head>').replace('</body>','<script>'+(ROOT/'assets/app.js').read_text()+'</script></body>')
        with sync_playwright() as pw:
            try: browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            except Exception: self.skipTest('Local Chromium unavailable')
            for width in (390,768,1440):
                page=browser.new_page(viewport={'width':width,'height':900})
                page.set_content(markup,wait_until='domcontentloaded')
                self.assertLessEqual(page.evaluate('document.documentElement.scrollWidth'),width+1)
                self.assertEqual(page.locator('[data-article-card]:visible').count(),3)
                page.locator('[data-article-search]').fill('authorization')
                self.assertEqual(page.locator('[data-article-card]:visible').count(),1)
                page.locator('[data-article-search]').fill('')
                page.get_by_role('button',name='Android security').click()
                self.assertEqual(page.locator('[data-article-card]:visible').count(),1)
                page.get_by_role('button',name='All articles').click()
                self.assertEqual(page.locator('[data-article-card]:visible').count(),3)
                self.assertEqual(page.locator('a[href="editorial-policy.html"]').count(),1)
                page.close()
            browser.close()

if __name__=='__main__':unittest.main()
