const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('=== WordPress 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('\n=== 1. 모든 페이지 완전 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    // 전체 선택 후 삭제
    let deleted = 0;
    for (let i = 0; i < 3; i++) {
        await page.evaluate(() => {
            const checkbox = document.querySelector('#cb-select-all-1');
            if (checkbox) checkbox.click();
        });

        await new Promise(r => setTimeout(r, 500));

        try {
            await page.select('#bulk-action-selector-top', 'trash');
            await page.click('#doaction');
            await new Promise(r => setTimeout(r, 3000));
            deleted++;
            console.log(`✓ ${i + 1}차 삭제 완료`);

            await page.reload();
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            break;
        }
    }

    console.log('\n=== 2. 휴지통 비우기 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_status=trash&post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    try {
        const emptyTrashBtn = await page.$('#delete_all');
        if (emptyTrashBtn) {
            await emptyTrashBtn.click();
            await new Promise(r => setTimeout(r, 2000));
            console.log('✓ 휴지통 비움');
        }
    } catch (e) {
        console.log('휴지통 이미 비어있음');
    }

    console.log('\n=== 3. 홈페이지 설정 강제 변경 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        // "최신 글" 강제 선택
        const postsRadio = document.querySelector('input[name="show_on_front"][value="posts"]');
        if (postsRadio) {
            postsRadio.checked = true;
            postsRadio.click();
        }

        // 모든 페이지 선택 해제
        const selects = document.querySelectorAll('select[name^="page_"]');
        selects.forEach(select => {
            if (select) select.value = '0';
        });
    });

    await new Promise(r => setTimeout(r, 500));
    await page.click('#submit');
    await page.waitForNavigation();
    console.log('✓ 홈페이지를 "최신 글"로 강제 설정');

    console.log('\n=== 4. Twenty Twenty-Three 테마 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    const tt3Deleted = await page.evaluate(() => {
        const tt3 = document.querySelector('[data-slug="twentytwentythree"]');
        if (tt3 && !tt3.classList.contains('active')) {
            const deleteBtn = tt3.querySelector('.delete-theme');
            if (deleteBtn) {
                deleteBtn.click();
                return true;
            }
        }
        return false;
    });

    if (tt3Deleted) {
        await new Promise(r => setTimeout(r, 1500));
        try {
            await page.click('#submit');
            await new Promise(r => setTimeout(r, 3000));
            console.log('✓ Twenty Twenty-Three 삭제');
        } catch (e) { }
    }

    console.log('\n✅ 완료!');
    console.log('\n이제:');
    console.log('1. Ctrl+Shift+Delete로 캐시 삭제');
    console.log('2. https://kimnhyunlaw.com 접속');
    console.log('\n깨끗한 블로그가 보일 것입니다!');

    await browser.close();
})();
