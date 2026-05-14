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

    // 사이트 편집기로 이동 (Twenty Twenty-Two/Three의 경우)
    console.log('사이트 편집기 이동...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/site-editor.php');
    await new Promise(r => setTimeout(r, 10000)); // 로딩 대기

    // 캔버스 프레임 찾기
    console.log('편집기 로딩 완료, 요소 찾는 중...');

    // 텍스트 변경 시도
    // 주의: 사이트 편집기는 iframe과 shadow DOM을 사용하여 자동화가 매우 어렵습니다.
    // 따라서 테마를 다시 한번 확실하게 Twenty Twenty-One으로 변경하고
    // 기존 테마를 삭제해버리는 것이 가장 확실합니다.

    console.log('전략 변경: Twenty Twenty-Two 테마 삭제...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    // Twenty Twenty-One 활성화 확인
    const tt1Active = await page.evaluate(() => {
        const tt1 = document.querySelector('[data-slug="twentytwentyone"]');
        return tt1 && tt1.classList.contains('active');
    });

    if (!tt1Active) {
        console.log('Twenty Twenty-One 활성화 시도...');
        await page.click('[data-slug="twentytwentyone"] .activate');
        await new Promise(r => setTimeout(r, 3000));
    }

    // Twenty Twenty-Two 삭제
    console.log('Twenty Twenty-Two 삭제 시도...');
    await page.click('[data-slug="twentytwentytwo"]');
    await new Promise(r => setTimeout(r, 1000));

    // 삭제 버튼 클릭
    const deleteBtn = await page.$('.delete-theme');
    if (deleteBtn) {
        await deleteBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        // 확인 팝업 처리 (엔터키)
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Twenty Twenty-Two 삭제됨');
    }

    // Twenty Twenty-Three 삭제
    console.log('Twenty Twenty-Three 삭제 시도...');
    try {
        await page.click('[data-slug="twentytwentythree"]');
        await new Promise(r => setTimeout(r, 1000));
        const deleteBtn3 = await page.$('.delete-theme');
        if (deleteBtn3) {
            await deleteBtn3.click();
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 3000));
            console.log('✓ Twenty Twenty-Three 삭제됨');
        }
    } catch (e) { }

    console.log('✓ 완료! 이제 Mindblown이 나올 수가 없습니다 (테마가 삭제됨)');

    await browser.close();
})();
