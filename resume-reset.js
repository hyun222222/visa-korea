const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    console.log('=== 작업 이어하기 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    // 4. 모든 글 삭제 (재시도)
    console.log('=== 4. 글 삭제 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit.php');
    try {
        const hasItems = await page.$('#cb-select-all-1');
        if (hasItems) {
            await page.click('#cb-select-all-1');
            await page.select('#bulk-action-selector-top', 'trash');
            await page.click('#doaction');
            await new Promise(r => setTimeout(r, 5000));
        }
    } catch (e) { }

    // 5. 설정 초기화
    console.log('=== 5. 설정 초기화 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await page.evaluate(() => {
        document.querySelector('#blogname').value = '김앤현 법률사무소';
        document.querySelector('#blogdescription').value = '이기는 부동산법 김앤현법률사무소';
    });
    await page.click('#submit');
    await page.waitForNavigation();

    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await page.evaluate(() => {
        const postsRadio = document.querySelector('input[value="posts"]');
        if (postsRadio) postsRadio.click();
    });
    await page.click('#submit');
    await page.waitForNavigation();

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

    // 7. PDF 업로드
    console.log('=== 7. PDF 업로드 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/media-new.php');
    const fileInput = await page.$('input[type="file"]');
    const pdfPath = path.resolve('C:\\Projects\\anti\\김앤현-부동산소개.pdf');
    await fileInput.uploadFile(pdfPath);
    await new Promise(r => setTimeout(r, 8000));

    // 8. 소개 페이지 생성
    console.log('=== 8. 소개 페이지 생성 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php?post_type=page');
    await new Promise(r => setTimeout(r, 5000));

    // 제목
    await page.keyboard.type('김앤현 법률사무소 소개');
    await page.keyboard.press('Enter');

    // 내용
    await page.keyboard.type('이기는 부동산법, 김앤현 법률사무소입니다.');
    await page.keyboard.press('Enter');

    // 파일 블록
    await page.keyboard.type('/file');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));

    // 미디어 라이브러리 선택
    const mediaBtn = await page.$('button.components-button:not(.block-editor-media-placeholder__button)');
    // 선택자가 복잡하므로 텍스트로 찾기 시도
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const mediaLibBtn = buttons.find(b => b.textContent.includes('Media Library') || b.textContent.includes('미디어 라이브러리'));
        if (mediaLibBtn) mediaLibBtn.click();
    });

    await new Promise(r => setTimeout(r, 3000));

    // 첫 번째 파일 선택
    await page.click('.attachment:first-child');
    await new Promise(r => setTimeout(r, 1000));

    // 선택 버튼
    await page.click('.media-button-select');
    await new Promise(r => setTimeout(r, 2000));

    // 공개
    const publishBtn = await page.$('.editor-post-publish-panel__toggle');
    if (publishBtn) {
        await publishBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        await page.click('.editor-post-publish-button');
    }

    console.log('✓ 완료!');
    await browser.close();
})();
