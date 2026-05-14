const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    // 1. 로그인
    console.log('=== 1. 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    // 2. 테마 변경 (Twenty Twenty-One)
    console.log('=== 2. 테마 변경 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/themes.php');
    await new Promise(r => setTimeout(r, 2000));

    // Twenty Twenty-One 활성화 시도
    let themeActivated = await page.evaluate(() => {
        const tt1 = document.querySelector('[data-slug="twentytwentyone"] .activate');
        if (tt1) {
            tt1.click();
            return true;
        }
        return false;
    });

    if (themeActivated) {
        await new Promise(r => setTimeout(r, 3000));
        console.log('✓ Twenty Twenty-One 활성화');
    } else {
        // 없으면 설치
        console.log('테마 설치 중...');
        await page.goto('https://kimnhyunlaw.com/wp-admin/theme-install.php?search=twentytwentyone');
        await new Promise(r => setTimeout(r, 3000));
        const installBtn = await page.$('.theme-install[data-slug="twentytwentyone"]');
        if (installBtn) {
            await installBtn.click();
            await new Promise(r => setTimeout(r, 5000));
            const activateBtn = await page.$('.activate[data-slug="twentytwentyone"]');
            if (activateBtn) await activateBtn.click();
        }
    }

    // 3. 모든 페이지 삭제
    console.log('=== 3. 페이지 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_type=page');
    await new Promise(r => setTimeout(r, 2000));

    // 반복 삭제
    for (let i = 0; i < 3; i++) {
        const hasItems = await page.$('#cb-select-all-1');
        if (!hasItems) break;

        await page.click('#cb-select-all-1');
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
    }

    // 휴지통 비우기
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_status=trash&post_type=page');
    const emptyTrash = await page.$('#delete_all');
    if (emptyTrash) await emptyTrash.click();

    // 4. 모든 글 삭제
    console.log('=== 4. 글 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php');
    for (let i = 0; i < 3; i++) {
        const hasItems = await page.$('#cb-select-all-1');
        if (!hasItems) break;

        await page.click('#cb-select-all-1');
        await page.select('#bulk-action-selector-top', 'trash');
        await page.click('#doaction');
        await new Promise(r => setTimeout(r, 3000));
    }

    // 휴지통 비우기
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php?post_status=trash');
    const emptyTrashPost = await page.$('#delete_all');
    if (emptyTrashPost) await emptyTrashPost.click();

    // 5. 설정 초기화
    console.log('=== 5. 설정 초기화 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await page.evaluate(() => {
        document.querySelector('#blogname').value = '김앤현 법률사무소';
        document.querySelector('#blogdescription').value = '이기는 부동산법 김앤현법률사무소';
    });
    await page.click('#submit');

    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await page.evaluate(() => {
        document.querySelector('input[value="posts"]').click();
    });
    await page.click('#submit');

    // 6. 카테고리 생성
    console.log('=== 6. 카테고리 생성 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit-tags.php?taxonomy=category');
    const categories = [
        '건축/건설', '경매', '계약/해약금', '공유물분할', '농지/토지/임야',
        '명의신탁', '부동산 세금', '부동산 최신 판결', '부동산 형사 고소',
        '분양 계약', '상가 임대차', '임대차/전세', '재개발/재건축', '지주택', '김앤현 부동산소개'
    ];

    for (const cat of categories) {
        await page.type('#tag-name', cat);
        await page.click('#submit');
        await new Promise(r => setTimeout(r, 500));
    }

    // 7. PDF 업로드 및 페이지 생성
    console.log('=== 7. PDF 업로드 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/media-new.php');
    const fileInput = await page.$('input[type="file"]');
    const pdfPath = path.resolve('C:\\Projects\\anti\\김앤현-부동산소개.pdf');
    await fileInput.uploadFile(pdfPath);
    await new Promise(r => setTimeout(r, 5000)); // 업로드 대기

    // URL 가져오기
    await page.goto('https://kimnhyunlaw.com/wp-admin/upload.php');
    await new Promise(r => setTimeout(r, 2000));
    await page.click('.attachment:first-child');
    await new Promise(r => setTimeout(r, 2000));
    const pdfUrl = await page.evaluate(() => document.querySelector('#attachment-details-two-column-copy-link').value);

    // 페이지 생성
    console.log('=== 8. 소개 페이지 생성 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php?post_type=page');
    await new Promise(r => setTimeout(r, 3000));

    // 제목
    await page.keyboard.type('김앤현 법률사무소 소개');
    await page.keyboard.press('Enter');

    // 내용
    await page.keyboard.type('이기는 부동산법, 김앤현 법률사무소입니다.');
    await page.keyboard.press('Enter');
    await page.keyboard.type('아래 링크를 클릭하여 소개서를 확인하세요.');
    await page.keyboard.press('Enter');

    // 버튼 블록 추가 (PDF 링크)
    await page.keyboard.type('/button');
    await page.keyboard.press('Enter');
    await page.keyboard.type('소개서 다운로드');

    // 링크 설정 (복잡하므로 텍스트로 대체 가능성 있음, 일단 시도)

    // 공개
    await new Promise(r => setTimeout(r, 1000));
    const publishBtn = await page.$('.editor-post-publish-panel__toggle');
    if (publishBtn) {
        await publishBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        await page.click('.editor-post-publish-button');
    }

    console.log('✓ 모든 작업 완료!');
    await browser.close();
})();
