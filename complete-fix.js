const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('=== 1. WordPress 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();
    console.log('✓ 로그인 완료');

    console.log('\n=== 2. Twenty Twenty-Three 테마로 변경 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 3000));

    const themeChanged = await page.evaluate(() => {
        // Twenty Twenty-Three 활성화
        const tt3Btn = document.querySelector('[data-slug="twentytwentythree"] .activate');
        if (tt3Btn) {
            tt3Btn.click();
            return 'twentytwentythree';
        }

        // 없으면 Twenty Twenty-One
        const tt1Btn = document.querySelector('[data-slug="twentytwentyone"] .activate');
        if (tt1Btn) {
            tt1Btn.click();
            return 'twentytwentyone';
        }

        return 'none';
    });

    if (themeChanged !== 'none') {
        await new Promise(r => setTimeout(r, 3000));
        console.log(`✓ ${themeChanged} 테마 활성화`);
    }

    console.log('\n=== 3. 모든 페이지 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    const pagesDeleted = await page.evaluate(() => {
        const rows = document.querySelectorAll('#the-list tr:not(.no-items)');
        if (rows.length > 0) {
            document.querySelector('#cb-select-all-1')?.click();
            return rows.length;
        }
        return 0;
    });

    if (pagesDeleted > 0) {
        await new Promise(r => setTimeout(r, 500));
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log(`✓ ${pagesDeleted}개 페이지 삭제됨`);
    } else {
        console.log('✓ 삭제할 페이지 없음');
    }

    console.log('\n=== 4. 홈페이지 설정 변경 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 2000));

    const settingChanged = await page.evaluate(() => {
        const postsRadio = document.querySelector('input[name="show_on_front"][value="posts"]');
        if (postsRadio && !postsRadio.checked) {
            postsRadio.click();

            // 페이지 선택 해제
            const pageSelect = document.querySelector('select[name="page_on_front"]');
            if (pageSelect) pageSelect.value = '0';

            const postsSelect = document.querySelector('select[name="page_for_posts"]');
            if (postsSelect) postsSelect.value = '0';

            return true;
        }
        return false;
    });

    if (settingChanged) {
        await new Promise(r => setTimeout(r, 500));
        await page.click('#submit');
        await page.waitForNavigation();
        console.log('✓ 홈페이지를 "최신 글"로 변경');
    } else {
        console.log('✓ 이미 "최신 글" 모드');
    }

    console.log('\n=== 5. Astra 테마 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    const astraDeleted = await page.evaluate(() => {
        const astra = document.querySelector('[data-slug="astra"]');
        if (astra && !astra.classList.contains('active')) {
            const deleteBtn = astra.querySelector('.delete-theme');
            if (deleteBtn) {
                deleteBtn.click();
                return true;
            }
        }
        return false;
    });

    if (astraDeleted) {
        await new Promise(r => setTimeout(r, 1500));
        try {
            await page.click('#submit');
            await new Promise(r => setTimeout(r, 3000));
            console.log('✓ Astra 테마 삭제됨');
        } catch (e) {
            console.log('✓ Astra 삭제 확인 대기 중...');
        }
    } else {
        console.log('✓ Astra 이미 없음');
    }

    console.log('\n=== 완료! ===');
    console.log('브라우저에서:');
    console.log('1. Ctrl+Shift+Delete 눌러서');
    console.log('2. "전체 기간" 선택');
    console.log('3. "캐시된 이미지 및 파일" 체크');
    console.log('4. 데이터 삭제');
    console.log('\n그 다음 https://kimnhyunlaw.com 접속하세요!');

    await browser.close();
})();
