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

    console.log('메뉴 설정 이동...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/nav-menus.php');
    await new Promise(r => setTimeout(r, 2000));

    // 1. 카테고리 섹션 열기
    console.log('카테고리 섹션 열기...');
    await page.evaluate(() => {
        const catHeader = document.querySelector('#add-category .accordion-section-title');
        if (catHeader) catHeader.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 2. "모두 보기" 탭 클릭
    console.log('모두 보기 클릭...');
    await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('#add-category .tabs li a'));
        const viewAll = tabs.find(t => t.textContent.includes('View All') || t.textContent.includes('모두 보기'));
        if (viewAll) viewAll.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 3. 모든 카테고리 체크
    console.log('모든 카테고리 체크...');
    await page.evaluate(() => {
        const checkboxes = document.querySelectorAll('#categorychecklist input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
    });

    // 4. 메뉴에 추가
    console.log('메뉴에 추가...');
    await page.click('#submit-category');
    await new Promise(r => setTimeout(r, 5000)); // 추가 대기

    // 5. 메뉴 위치 설정 (Primary)
    console.log('메뉴 위치 설정...');
    await page.evaluate(() => {
        const primaryCheck = document.querySelector('input[name="menu-locations[primary]"]');
        if (primaryCheck) primaryCheck.checked = true;
    });

    // 6. 저장
    console.log('저장...');
    await page.click('#save_menu_header');
    await page.waitForNavigation();

    console.log('✓ 모든 카테고리가 메뉴에 추가되었습니다.');

    await browser.close();
})();
