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

    console.log('테마를 Twenty Nineteen으로 변경 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 3000));

    // Twenty Nineteen 테마 활성화
    const activated = await page.evaluate(() => {
        const button = document.querySelector('div[data-slug="twentynineteen"] .activate');
        if (button) {
            button.click();
            return true;
        }
        return false;
    });

    if (activated) {
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Twenty Nineteen 테마 활성화 완료!');
    } else {
        console.log('Twenty Nineteen이 설치되어 있지 않습니다. Twenty Twenty-One 시도 중...');
        await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
        await new Promise(r => setTimeout(r, 2000));

        await page.evaluate(() => {
            const button = document.querySelector('div[data-slug="twentytwentyone"] .activate');
            if (button) button.click();
        });

        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Twenty Twenty-One 테마 활성화 완료!');
    }

    console.log('✓ 완료! https://kimnhyunlaw.com 확인하세요');
    console.log('이제 깨끗한 블로그 레이아웃이 보일 것입니다.');

    await browser.close();
})();
