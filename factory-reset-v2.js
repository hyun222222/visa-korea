const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000); // 타임아웃 1분으로 증가

    console.log('=== 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    // WP Reset 페이지로 바로 이동 시도 (이미 설치된 경우 대비)
    console.log('=== WP Reset 페이지 이동 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/tools.php?page=wp-reset');

    // 설치 안되어 있으면 설치 페이지로
    if (page.url().includes('plugin-install.php') || await page.$('body.tools_page_wp-reset') === null) {
        console.log('플러그인 설치 필요...');
        await page.goto('https://kimnhyunlaw.com/wp-admin/plugin-install.php?s=wp+reset&tab=search&type=term');
        await new Promise(r => setTimeout(r, 3000));

        const installBtn = await page.$('.plugin-card-wp-reset .install-now');
        if (installBtn) {
            await installBtn.click();
            await new Promise(r => setTimeout(r, 10000));
            const activateBtn = await page.$('.plugin-card-wp-reset .activate-now');
            if (activateBtn) {
                await activateBtn.click();
                await page.waitForNavigation();
            }
        }
        await page.goto('https://kimnhyunlaw.com/wp-admin/tools.php?page=wp-reset');
    }

    // 팝업 닫기
    try {
        const closePopup = await page.$('.wpr-modal-close');
        if (closePopup) await closePopup.click();
    } catch (e) { }

    console.log('=== 초기화 실행 ===');
    await new Promise(r => setTimeout(r, 2000));

    // Reset 입력
    await page.evaluate(() => {
        // 스크롤
        window.scrollTo(0, document.body.scrollHeight);
        // 입력 필드 찾기 (여러 개일 수 있음, Site Reset 섹션 찾기)
        const inputs = document.querySelectorAll('input[name="reset_confirmation"]');
        // 보통 마지막 것이 Site Reset임
        if (inputs.length > 0) {
            inputs[inputs.length - 1].value = 'reset';
            inputs[inputs.length - 1].dispatchEvent(new Event('input'));
        }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 버튼 클릭
    const resetBtn = await page.$('#reset-site-btn');
    if (resetBtn) {
        await resetBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        const confirmBtn = await page.$('#reset-site-modal-btn');
        if (confirmBtn) {
            await confirmBtn.click();
            console.log('초기화 진행 중...');
            await page.waitForNavigation();
            console.log('✓ 초기화 완료!');
        }
    } else {
        console.log('리셋 버튼을 찾을 수 없습니다.');
    }

    await browser.close();
})();
