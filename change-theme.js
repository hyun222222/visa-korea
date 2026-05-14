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

    console.log('테마를 Twenty Twenty-Four로 변경 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await page.waitForSelector('body');

    //Twenty Twenty-Four 활성화 버튼 찾기
    try {
        const activateButton = await page.$('div[data-slug="twentytwentyfour"] .activate');
        if (activateButton) {
            await activateButton.click();
            await page.waitForNavigation();
            console.log('✓ Twenty Twenty-Four 테마 활성화 완료!');
        } else {
            console.log('이미 활성화되어 있거나 테마를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.log('테마 변경 중 오류:', error.message);
    }

    console.log('확인: https://kimnhyunlaw.com');

    await browser.close();
})();
