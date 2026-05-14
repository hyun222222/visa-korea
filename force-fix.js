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

    // 1. 현재 설정 확인
    console.log('\n=== 현재 설정 확인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 2000));

    const currentSettings = await page.evaluate(() => {
        const showOnFront = document.querySelector('input[name="show_on_front"]:checked')?.value;
        const pageOnFront = document.querySelector('select[name="page_on_front"]')?.value;
        const pageForPosts = document.querySelector('select[name="page_for_posts"]')?.value;
        return { showOnFront, pageOnFront, pageForPosts };
    });

    console.log('현재 설정:', currentSettings);

    // 2. 강제로 "posts"로 변경
    console.log('\n=== 강제 변경 중 ===');
    await page.evaluate(() => {
        // posts 라디오 버튼 선택
        const postsRadio = document.querySelector('input[name="show_on_front"][value="posts"]');
        if (postsRadio) {
            postsRadio.checked = true;
            postsRadio.click();
        }

        // 페이지 선택 해제
        const homeSelect = document.querySelector('select[name="page_on_front"]');
        if (homeSelect) homeSelect.value = '0';

        const postsSelect = document.querySelector('select[name="page_for_posts"]');
        if (postsSelect) postsSelect.value = '0';
    });

    await new Promise(r => setTimeout(r, 500));
    await page.click('#submit');
    await page.waitForNavigation();
    console.log('✓ 설정 저장 완료');

    // 3. 홈 페이지 삭제 (혹시 남아있다면)
    console.log('\n=== Home 페이지 확인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    const deletedPages = await page.evaluate(() => {
        const rows = document.querySelectorAll('#the-list tr');
        let deleted = 0;
        rows.forEach(row => {
            const title = row.querySelector('.row-title')?.textContent;
            if (title && (title.includes('Home') || title.includes('혁신') || title.includes('Earth'))) {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = true;
                    deleted++;
                }
            }
        });
        return deleted;
    });

    if (deletedPages > 0) {
        await new Promise(r => setTimeout(r, 500));
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log(`✓ ${deletedPages}개 페이지 삭제`);
    } else {
        console.log('삭제할 페이지 없음');
    }

    // 4. 최종 확인
    console.log('\n=== 최종 설정 확인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 1000));

    const finalSettings = await page.evaluate(() => {
        const showOnFront = document.querySelector('input[name="show_on_front"]:checked')?.value;
        const pageOnFront = document.querySelector('select[name="page_on_front"]')?.value;
        return { showOnFront, pageOnFront };
    });

    console.log('최종 설정:', finalSettings);
    console.log('\n✓ 완료!');
    console.log('https://kimnhyunlaw.com 에서 Ctrl+Shift+Delete로 캐시 삭제 후 확인하세요');

    await browser.close();
})();
