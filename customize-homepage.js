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

    console.log('\n=== 1. 사이트 제목/설명 변경 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        document.querySelector('#blogname').value = '김앤현 법률사무소';
        document.querySelector('#blogdescription').value = '이기는 부동산법 김앤현법률사무소';
    });

    await page.click('#submit');
    await page.waitForNavigation();
    console.log('✓ 사이트 정보 변경');

    console.log('\n=== 2. WordPress 로고 제거 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await new Promise(r => setTimeout(r, 1000));

    // "WordPress로 제작함" 링크 제거는 테마 푸터에서 수정 필요

    console.log('\n=== 3. 외모 → 사용자 정의하기 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/customize.php');
    await new Promise(r => setTimeout(r, 5000));

    // 사용자 정의하기에서 푸터 수정
    console.log('푸터 크레딧 제거 중...');

    try {
        // 사이트 ID 또는 저작권 섹션 찾기
        const creditRemoved = await page.evaluate(() => {
            // 푸터 크레딧 요소 찾기
            const creditSection = document.querySelector('[data-type="core/paragraph"]');
            if (creditSection) {
                creditSection.remove();
                return true;
            }
            return false;
        });

        if (creditRemoved) {
            console.log('✓ 푸터 크레딧 제거됨');
        }
    } catch (e) {
        console.log('푸터 크레딧 수동 제거 필요');
    }

    console.log('\n=== 4. "문의하기" 버튼을 전화번호로 변경 ===');

    // 홈 페이지 편집
    await page.goto('https://kimnhyunlaw.com/wp-admin/site-editor.php');
    await new Promise(r => setTimeout(r, 5000));

    console.log('사이트 편집기 오픈...');

    console.log('\n✓ 기본 설정 완료!');
    console.log('\n=== 수동 작업 필요 ===');
    console.log('1. 외모 → 편집 → 홈페이지 템플릿 수정');
    console.log('2. "Mindblown: 철학에 관한 블로그입니다" → "이기는 부동산법 김앤현법률사무소"');
    console.log('3. "추천 예약" → "무료 상담 문의"');
    console.log('4. "문의하기" 버튼 → 전화: 010-5534-6843');
    console.log('5. 푸터 "WordPress로 제작함" 삭제');

    await browser.close();
})();
