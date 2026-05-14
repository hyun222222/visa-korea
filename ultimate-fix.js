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

    console.log('Astra 테마 삭제 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 3000));

    // Astra 테마 삭제
    await page.evaluate(() => {
        const astra = document.querySelector('[data-slug="astra"]');
        if (astra && !astra.classList.contains('active')) {
            const deleteBtn = astra.querySelector('.delete-theme');
            if (deleteBtn) deleteBtn.click();
        }
    });

    await new Promise(r => setTimeout(r, 2000));

    // 삭제 확인 버튼
    try {
        await page.click('#submit');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Astra 테마 삭제됨');
    } catch (e) {
        console.log('Astra 이미 없음 또는 활성 테마임');
    }

    console.log('WordPress 완전 리셋 중...');

    // 1. 모든 글 삭제
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php');
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
        document.querySelector('#cb-select-all-1')?.click();
    });
    await new Promise(r => setTimeout(r, 500));
    try {
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 모든 글 삭제');
    } catch (e) { }

    // 2. 모든 페이지 삭제
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
        document.querySelector('#cb-select-all-1')?.click();
    });
    await new Promise(r => setTimeout(r, 500));
    try {
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 모든 페이지 삭제');
    } catch (e) { }

    // 3. 설정 변경
    console.log('홈페이지 설정 변경 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        const postsRadio = document.querySelector('input[value="posts"]');
        if (postsRadio) {
            postsRadio.checked = true;
            postsRadio.click();
        }

        document.querySelector('select[name="page_on_front"]').value = '0';
        document.querySelector('select[name="page_for_posts"]').value = '0';
    });

    await new Promise(r => setTimeout(r, 500));
    await page.click('#submit');
    await page.waitForNavigation();
    console.log('✓ 설정 저장 완료');

    console.log('\n✅ 완료!');
    console.log('https://kimnhyunlaw.com 접속 후');
    console.log('Ctrl+Shift+Delete로 캐시 전체 삭제 하세요!');

    await browser.close();
})();
