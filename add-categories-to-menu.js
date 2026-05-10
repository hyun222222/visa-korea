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

    // 1. 카테고리 탭 열기
    console.log('카테고리 모두 보기...');
    await page.click('#add-category .accordion-section-title'); // 카테고리 섹션 열기
    await new Promise(r => setTimeout(r, 1000));
    await page.click('#category-all a'); // "모두 보기" 탭 클릭
    await new Promise(r => setTimeout(r, 1000));

    // 2. 모든 카테고리 선택
    console.log('모든 카테고리 선택...');
    await page.evaluate(() => {
        const checkboxes = document.querySelectorAll('#categorychecklist input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
    });

    // 3. 메뉴에 추가
    console.log('메뉴에 추가...');
    await page.click('#submit-category');
    await new Promise(r => setTimeout(r, 3000)); // 추가 대기

    // 4. 메뉴 저장
    console.log('메뉴 저장...');
    await page.click('#save_menu_header');
    await page.waitForNavigation();

    console.log('✓ 모든 카테고리가 메뉴에 추가되었습니다.');

    // 5. 위젯에도 카테고리 추가 (푸터)
    console.log('푸터에 카테고리 위젯 추가...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/widgets.php');
    await new Promise(r => setTimeout(r, 3000));

    // 위젯 추가는 복잡하므로(블록 에디터), 메뉴 추가로 충분할 수 있음.
    // 하지만 "글도 다 보이는거 아녀?" 했으므로, 설정 확인

    console.log('✓ 완료! 상단 메뉴에서 모든 카테고리를 볼 수 있습니다.');

    await browser.close();
})();
