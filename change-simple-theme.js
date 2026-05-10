const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('WordPress 로그인...');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('\nTwenty Twenty-Two 테마로 변경...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 3000));

    const themeChanged = await page.evaluate(() => {
        const tt2 = document.querySelector('[data-slug="twentytwentytwo"] .activate');
        if (tt2) {
            tt2.click();
            return 'twentytwentytwo';
        }

        const tt1 = document.querySelector('[data-slug="twentytwentyone"] .activate');
        if (tt1) {
            tt1.click();
            return 'twentytwentyone';
        }

        return 'none';
    });

    if (themeChanged !== 'none') {
        await new Promise(r => setTimeout(r, 3000));
        console.log(`✓ ${themeChanged} 테마 활성화됨`);
    } else {
        console.log('이미 활성화되어 있거나 테마를 찾을 수 없음');
    }

    console.log('\n✓ 완료!');
    console.log('https://kimnhyunlaw.com 확인하세요');
    console.log('\n이제 훨씬 깔끔한 블로그가 보일 것입니다!');

    await browser.close();
})();
