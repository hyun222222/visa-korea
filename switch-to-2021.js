const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('로그인...');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('테마 변경 (Twenty Twenty-One)...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    // Twenty Twenty-One 찾기 및 활성화
    const activated = await page.evaluate(() => {
        const theme = document.querySelector('[data-slug="twentytwentyone"]');
        if (theme) {
            const activateBtn = theme.querySelector('.activate');
            if (activateBtn) {
                activateBtn.click();
                return true;
            }
        }
        return false;
    });

    if (activated) {
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Twenty Twenty-One 활성화 완료');
    } else {
        console.log('테마 설치 필요...');
        await page.goto('https://kimnhyunlaw.com/wp-admin/theme-install.php?search=twentytwentyone');
        await new Promise(r => setTimeout(r, 3000));

        const installBtn = await page.$('.theme-install[data-slug="twentytwentyone"]');
        if (installBtn) {
            await installBtn.click();
            await new Promise(r => setTimeout(r, 5000));
            const activateBtn = await page.$('.activate[data-slug="twentytwentyone"]');
            if (activateBtn) await activateBtn.click();
            console.log('✓ 설치 및 활성화 완료');
        }
    }

    console.log('완료! 이제 Mindblown 문구가 사라졌을 것입니다.');

    await browser.close();
})();
