const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 1. 로그인
    console.log('=== 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    // 2. WP Reset 플러그인 설치
    console.log('=== WP Reset 플러그인 설치 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/plugin-install.php?s=wp+reset&tab=search&type=term');
    await new Promise(r => setTimeout(r, 3000));

    const installBtn = await page.$('.plugin-card-wp-reset .install-now');
    if (installBtn) {
        await installBtn.click();
        await new Promise(r => setTimeout(r, 5000)); // 설치 대기

        // 활성화
        const activateBtn = await page.$('.plugin-card-wp-reset .activate-now');
        if (activateBtn) {
            await activateBtn.click();
            await page.waitForNavigation();
        }
    }

    // 3. 리셋 실행
    console.log('=== 사이트 초기화 실행 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/tools.php?page=wp-reset');
    await new Promise(r => setTimeout(r, 2000));

    // 팝업 닫기 (있다면)
    try {
        const closePopup = await page.$('.wpr-modal-close');
        if (closePopup) await closePopup.click();
    } catch (e) { }

    // 리셋 섹션으로 스크롤
    await page.evaluate(() => {
        window.scrollBy(0, 1000);
    });

    // 리셋 입력
    try {
        await page.type('input[name="reset_confirmation"]', 'reset');
        await new Promise(r => setTimeout(r, 1000));

        // 리셋 버튼 클릭
        const resetBtn = await page.$('#reset-site-btn');
        if (resetBtn) {
            await resetBtn.click();
            await new Promise(r => setTimeout(r, 1000));

            // 확인 팝업
            const confirmBtn = await page.$('#reset-site-modal-btn');
            if (confirmBtn) {
                await confirmBtn.click();
                console.log('초기화 시작... (약 10초 소요)');
                await page.waitForNavigation({ timeout: 30000 });
            }
        }
    } catch (e) {
        console.log('리셋 실패 또는 이미 리셋됨: ' + e.message);
    }

    console.log('=== 초기화 완료 ===');

    // 4. Breeze 설치 및 캐시 삭제 (Cloudways 필수)
    console.log('=== 캐시 삭제 (Breeze) ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/plugin-install.php?s=breeze&tab=search&type=term');
    await new Promise(r => setTimeout(r, 3000));

    const installBreeze = await page.$('.plugin-card-breeze .install-now');
    if (installBreeze) {
        await installBreeze.click();
        await new Promise(r => setTimeout(r, 5000));

        const activateBreeze = await page.$('.plugin-card-breeze .activate-now');
        if (activateBreeze) {
            await activateBreeze.click();
            await page.waitForNavigation();
        }
    }

    // 캐시 퍼지
    try {
        await page.hover('#wp-admin-bar-breeze-admin-bar');
        await new Promise(r => setTimeout(r, 500));
        const purgeAll = await page.$('#wp-admin-bar-breeze-purge-all-cache a');
        if (purgeAll) {
            await purgeAll.click();
            console.log('✓ 서버 캐시 삭제 완료');
        }
    } catch (e) {
        console.log('캐시 삭제 메뉴 못찾음');
    }

    console.log('=== 기본 설정 복구 ===');
    // 사이트 제목
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await page.evaluate(() => {
        document.querySelector('#blogname').value = '김앤현 법률사무소';
        document.querySelector('#blogdescription').value = '이기는 부동산법 김앤현법률사무소';
    });
    await page.click('#submit');
    await page.waitForNavigation();

    // 카테고리 생성 (샘플 1개만, 나머지는 별도 스크립트로)
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit-tags.php?taxonomy=category');
    await page.type('#tag-name', '부동산 소송');
    await page.click('#submit');

    console.log('✓ 모든 작업 완료! 이제 정말 깨끗해졌습니다.');

    await browser.close();
})();
