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

    // 1. 모든 페이지 삭제
    console.log('템플릿 페이지 삭제 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    const pagesDeleted = await page.evaluate(() => {
        const checkbox = document.querySelector('#cb-select-all-1');
        if (checkbox) {
            checkbox.click();
            return true;
        }
        return false;
    });

    if (pagesDeleted) {
        await new Promise(r => setTimeout(r, 500));
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 페이지 삭제 완료');
    }

    // 2. 샘플 글 삭제 (있다면)
    console.log('샘플 글 확인 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php');
    await new Promise(r => setTimeout(r, 2000));

    const postsDeleted = await page.evaluate(() => {
        const checkbox = document.querySelector('#cb-select-all-1');
        if (checkbox) {
            checkbox.click();
            return true;
        }
        return false;
    });

    if (postsDeleted) {
        await new Promise(r => setTimeout(r, 500));
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ 샘플 글 삭제 완료');
    }

    // 3. 메뉴 삭제
    console.log('메뉴 정리 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/nav-menus.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        // 모든 메뉴 아이템 삭제
        const deleteButtons = document.querySelectorAll('.item-delete');
        deleteButtons.forEach(btn => btn.click());
    });

    await new Promise(r => setTimeout(r, 1000));
    const saveButton = await page.$('#save_menu_header');
    if (saveButton) {
        await saveButton.click();
        await new Promise(r => setTimeout(r, 2000));
        console.log('✓ 메뉴 정리 완료');
    }

    console.log('✓ 모든 템플릿 내용 삭제 완료!');
    console.log('확인: https://kimnhyunlaw.com');

    await browser.close();
})();
