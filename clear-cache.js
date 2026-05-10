const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('로그인 중...');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('캐시 플러그인 확인 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/plugins.php');
    await new Promise(r => setTimeout(r, 2000));

    // 캐시 플러그인 비활성화
    const hasCachePlugin = await page.evaluate(() => {
        const plugins = ['wp-super-cache', 'w3-total-cache', 'wp-rocket', 'autoptimize'];
        let found = false;
        plugins.forEach(slug => {
            const deactivateLink = document.querySelector(`tr[data-slug="${slug}"] .deactivate a`);
            if (deactivateLink) {
                deactivateLink.click();
                found = true;
            }
        });
        return found;
    });

    if (hasCachePlugin) {
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 캐시 플러그인 비활성화');
    }

    console.log('홈페이지 설정 최종 확인...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
        // "최신 글" 선택
        const postsRadio = document.querySelector('input[name="show_on_front"][value="posts"]');
        if (postsRadio && !postsRadio.checked) {
            postsRadio.click();
        }

        // 고정 페이지 선택 해제
        const homeSelect = document.querySelector('select[name="page_on_front"]');
        if (homeSelect) homeSelect.value = '0';

        const postsSelect = document.querySelector('select[name="page_for_posts"]');
        if (postsSelect) postsSelect.value = '0';
    });

    await page.click('#submit');
    await page.waitForNavigation();

    console.log('✓ 설정 완료!');
    console.log('브라우저에서 Ctrl+F5로 하드 리프레시 하세요');

    await browser.close();
})();
