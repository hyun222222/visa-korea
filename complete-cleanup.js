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

    console.log('모든 글과 페이지 삭제 중...');

    // 1. 모든 글 삭제
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php');
    await new Promise(r => setTimeout(r, 2000));

    // 전체 선택
    const hasPostsToDelete = await page.evaluate(() => {
        const rows = document.querySelectorAll('#the-list tr');
        if (rows.length > 0 && !rows[0].classList.contains('no-items')) {
            document.querySelector('#cb-select-all-1')?.click();
            return true;
        }
        return false;
    });

    if (hasPostsToDelete) {
        await new Promise(r => setTimeout(r, 500));
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 모든 글 삭제');
    }

    // 2. 모든 페이지 삭제  
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    const hasPagesToDelete = await page.evaluate(() => {
        const rows = document.querySelectorAll('#the-list tr');
        if (rows.length > 0 && !rows[0].classList.contains('no-items')) {
            document.querySelector('#cb-select-all-1')?.click();
            return true;
        }
        return false;
    });

    if (hasPagesToDelete) {
        await new Promise(r => setTimeout(r, 500));
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 모든 페이지 삭제');
    }

    // 3. Astra 테마 삭제
    console.log('Astra 테마 삭제 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        const astraTheme = document.querySelector('div[data-slug="astra"]');
        if (astraTheme) {
            const deleteButton = astraTheme.querySelector('.theme-actions .delete-theme');
            if (deleteButton) deleteButton.click();
        }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 삭제 확인 대화상자 처리
    try {
        await page.click('#submit');
        console.log('✓ Astra 테마 삭제 완료');
    } catch (e) {
        console.log('Astra 테마 삭제 버튼 없음 (이미 삭제됨)');
    }

    await new Promise(r => setTimeout(r, 2000));

    console.log('✓ 모든 Astra 컨텐츠 제거 완료!');
    console.log('https://kimnhyunlaw.com 확인하세요');

    await browser.close();
})();
