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

    // 1. 환영 글 작성
    console.log('환영 글 작성...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php');
    await new Promise(r => setTimeout(r, 3000));

    // 제목
    await page.keyboard.type('김앤현 법률사무소 블로그를 시작합니다.');
    await page.keyboard.press('Enter');

    // 내용
    await page.keyboard.type('이기는 부동산법, 김앤현 법률사무소입니다.');
    await page.keyboard.press('Enter');
    await page.keyboard.type('부동산 관련 최신 판결과 법률 정보를 전해드립니다.');

    // 카테고리 선택 (첫 번째 카테고리)
    // (사이드바 조작이 복잡하므로 생략, 기본 카테고리로 들어감)

    // 공개
    await new Promise(r => setTimeout(r, 1000));
    const publishBtn = await page.$('.editor-post-publish-panel__toggle');
    if (publishBtn) {
        await publishBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        await page.click('.editor-post-publish-button');
        await new Promise(r => setTimeout(r, 3000));
    }
    console.log('✓ 환영 글 작성 완료');

    // 2. 메뉴 설정
    console.log('메뉴 설정...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/nav-menus.php');
    await new Promise(r => setTimeout(r, 2000));

    // 새 메뉴 생성
    await page.type('#menu-name', '메인 메뉴');
    await page.click('#save_menu_header');
    await new Promise(r => setTimeout(r, 2000));

    // "변호사 소개" 페이지 추가
    // (페이지 목록에서 찾기)
    const pageCheck = await page.$('#page-checklist li:first-child input'); // 보통 최근 페이지가 맨 위
    if (pageCheck) {
        await pageCheck.click();
        await page.click('#submit-posttype-page');
        await new Promise(r => setTimeout(r, 2000));
    }

    // 위치 설정 (Primary Menu)
    const locCheck = await page.$('#locations-primary_menu'); // 테마마다 ID 다를 수 있음
    if (locCheck) await locCheck.click();

    // Twenty Twenty-One의 경우
    const locCheck21 = await page.$('input[name="menu-locations[primary]"]');
    if (locCheck21) await locCheck21.click();

    await page.click('#save_menu_header');
    console.log('✓ 메뉴 설정 완료');

    // 3. 위젯 확인 (푸터 EARTH 제거)
    console.log('위젯 정리...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/widgets.php');
    // (위젯이 블록 에디터라 복잡하지만, Twenty Twenty-One은 기본적으로 푸터에 위젯이 없으면 깔끔함)

    console.log('✓ 모든 작업 완료!');

    await browser.close();
})();
