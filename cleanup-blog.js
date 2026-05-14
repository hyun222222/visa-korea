const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        console.log('WordPress 로그인 중...');
        await page.goto('https://kimnhyunlaw.com/wp-login.php', { waitUntil: 'networkidle2' });

        await page.type('#user_login', 'catalyst305@gmail.com');
        await page.type('#user_pass', 'nF9JA7mEnh');
        await page.click('#wp-submit');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('불필요한 페이지 삭제 중...');
        await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page', { waitUntil: 'networkidle2' });

        // 모든 페이지 선택 후 삭제
        const deleted = await page.evaluate(() => {
            const checkbox = document.querySelector('#cb-select-all-1');
            if (checkbox) checkbox.click();
            return true;
        });

        if (deleted) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.select('#bulk-action-selector-top', 'trash');
            await page.click('#doaction');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log('✓ 페이지 삭제 완료!');
        }

        console.log('홈페이지 설정 확인 중...');
        await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php', { waitUntil: 'networkidle2' });

        await page.evaluate(() => {
            const radio = document.querySelector('input[name="show_on_front"][value="posts"]');
            if (radio && !radio.checked) radio.click();
        });

        await page.click('#submit');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('✓ 완료! https://kimnhyunlaw.com 확인하세요');

        await browser.close();
    } catch (error) {
        console.error('오류:', error.message);
    }
})();
