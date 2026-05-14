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

    console.log('설정 조정 중...');

    // 1. 홈페이지 설정을 posts로 AND 고정페이지를 비우기
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');

    await page.evaluate(() => {
        // "최신 글" 선택
        const postsRadio = document.querySelector('input[name="show_on_front"][value="posts"]');
        if (postsRadio) postsRadio.click();

        // 혹시 고정 페이지가 선택되어 있으면 제거
        const pageSelect = document.querySelector('select[name="page_on_front"]');
        if (pageSelect) pageSelect.value = '0';

        const postsPageSelect = document.querySelector('select[name="page_for_posts"]');
        if (postsPageSelect) postsPageSelect.value = '0';
    });

    await page.click('#submit');
    await page.waitForNavigation();
    console.log('✓ 홈페이지 설정 완료!');

    // 2. 사이트 제목/설명 변경
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');

    await page.evaluate(() => {
        const titleInput = document.querySelector('#blogname');
        const descInput = document.querySelector('#blogdescription');

        if (titleInput) {
            titleInput.value = '김앤현 법률사무소';
        }
        if (descInput) {
            descInput.value = '대한변호사협회 인증 부동산전문변호사';
        }
    });

    await page.click('#submit');
    await page.waitForNavigation();
    console.log('✓ 사이트 제목 변경 완료!');

    console.log('✓ 모든 설정 완료! https://kimnhyunlaw.com 확인하세요');

    await browser.close();
})();
