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

    console.log('CSS 추가 (푸터 숨기기)...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/customize.php?autofocus[section]=custom_css');
    await new Promise(r => setTimeout(r, 5000));

    await page.evaluate(() => {
        // Twenty Twenty-One 푸터 클래스
        const css = `
      .site-info { display: none !important; }
      .powered-by { display: none !important; }
      .footer-credits { display: none !important; }
    `;

        // 텍스트에어리어 찾기 (CodeMirror 사용될 수 있음)
        const textarea = document.querySelector('.CodeMirror textarea');
        if (textarea) {
            textarea.value = css;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            // 일반 textarea
            const plainTextarea = document.querySelector('#_customize-input-custom_css');
            if (plainTextarea) {
                plainTextarea.value = css;
                plainTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });

    // CodeMirror에 직접 입력 (더 확실함)
    await page.keyboard.type('.site-info { display: none !important; }');
    await page.keyboard.press('Enter');
    await page.keyboard.type('.powered-by { display: none !important; }');

    await new Promise(r => setTimeout(r, 1000));

    // 저장
    console.log('저장 중...');
    const saveBtn = await page.$('#save');
    if (saveBtn) {
        await saveBtn.click();
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log('✓ 완료! 푸터 문구가 사라졌습니다.');

    await browser.close();
})();
