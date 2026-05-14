const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('WordPress 로그인 중...');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('사이트 정보 변경 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        const titleInput = document.querySelector('#blogname');
        const descInput = document.querySelector('#blogdescription');

        if (titleInput) {
            titleInput.value = '김앤현 법률사무소';
        }

        if (descInput) {
            descInput.value = '이기는 부동산법 김앤현법률사무소';
        }
    });

    await page.click('#submit');
    await page.waitForNavigation();

    console.log('✓ 완료!');
    console.log('사이트 제목: 김앤현 법률사무소');
    console.log('설명: 이기는 부동산법 김앤현법률사무소');

    await browser.close();
})();
