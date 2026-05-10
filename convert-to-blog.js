const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('WordPress 로그인 중...');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');

    const username = 'catalyst305@gmail.com';
    const password = 'nF9JA7mEnh';

    await page.type('#user_login', username);
    await page.type('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('홈페이지 설정 변경 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');

    // "Your latest posts" 라디오 버튼 클릭
    await page.evaluate(() => {
        document.querySelector('input[name="show_on_front"][value="posts"]').click();
    });

    // 저장
    await page.click('#submit');
    await page.waitForNavigation();

    console.log('✓ 완료! 홈페이지가 블로그로 변경되었습니다.');
    console.log('확인: https://kimnhyunlaw.com');

    await browser.close();
})();
