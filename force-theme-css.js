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

    // 1. 테마 강제 변경
    console.log('테마 변경 (Twenty Twenty-One)...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    // 활성화 버튼 찾기
    const activated = await page.evaluate(() => {
        const theme = document.querySelector('[data-slug="twentytwentyone"]');
        if (theme) {
            const activateBtn = theme.querySelector('.activate');
            if (activateBtn) {
                activateBtn.click();
                return true;
            } else if (theme.classList.contains('active')) {
                return 'already_active';
            }
        }
        return false;
    });

    if (activated === true) {
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Twenty Twenty-One 활성화됨');
    } else if (activated === 'already_active') {
        console.log('✓ 이미 Twenty Twenty-One 활성화 상태');
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
        }
    }

    // 2. CSS 추가 (Customizer)
    console.log('CSS 추가...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/customize.php?autofocus[section]=custom_css');
    await new Promise(r => setTimeout(r, 5000));

    await page.evaluate(() => {
        const css = `
      .site-info { display: none !important; }
      .powered-by { display: none !important; }
      .footer-credits { display: none !important; }
      #colophon .site-info { display: none !important; }
    `;

        const textarea = document.querySelector('.CodeMirror textarea');
        if (textarea) {
            textarea.value = css;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 일반 textarea
        const plainTextarea = document.querySelector('#_customize-input-custom_css');
        if (plainTextarea) {
            plainTextarea.value = css;
            plainTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    // CodeMirror 직접 입력
    await page.keyboard.type('/* Hide Footer */ .site-info { display: none !important; }');
    await page.keyboard.press('Enter');

    await new Promise(r => setTimeout(r, 1000));

    // 저장
    const saveBtn = await page.$('#save');
    if (saveBtn) {
        await saveBtn.click();
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ CSS 저장 완료');
    }

    console.log('✓ 모든 작업 완료!');

    await browser.close();
})();
