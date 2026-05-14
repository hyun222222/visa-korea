const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('=== WordPress 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('=== PDF 업로드 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/media-new.php');
    await new Promise(r => setTimeout(r, 2000));

    // 파일 선택
    const fileInput = await page.$('input[type="file"]');
    const pdfPath = path.resolve('C:\\Projects\\anti\\김앤현-부동산소개.pdf');

    await fileInput.uploadFile(pdfPath);
    console.log('✓ PDF 업로드 시작...');

    // 업로드 완료 대기 (최대 10초)
    await new Promise(r => setTimeout(r, 10000));

    console.log('=== "변호사 소개" 페이지 생성 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php?post_type=page');
    await new Promise(r => setTimeout(r, 3000));

    // 제목 입력
    await page.type('.editor-post-title__input', '김앤현 법률사무소 소개');
    await new Promise(r => setTimeout(r, 500));

    // 콘텐츠 추가 (PDF 링크)
    await page.click('.is-root-container');
    await new Promise(r => setTimeout(r, 500));

    // 텍스트 블록 추가
    await page.keyboard.type('김앤현 법률사무소는 부동산 전문 법률사무소입니다.');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    // 파일 블록 추가
    await page.keyboard.type('/file');
    await new Promise(r => setTimeout(r, 500));
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));

    // 미디어 라이브러리에서 PDF 선택
    const mediaLibraryBtn = await page.$('button.components-button');
    if (mediaLibraryBtn) {
        await mediaLibraryBtn.click();
        await new Promise(r => setTimeout(r, 2000));

        // 첫 번째 파일 선택 (방금 업로드한 PDF)
        const firstAttachment = await page.$('.attachment');
        if (firstAttachment) {
            await firstAttachment.click();
            await new Promise(r => setTimeout(r, 500));

            // 선택 버튼 클릭
            const selectBtn = await page.$('button.media-button-select');
            if (selectBtn) {
                await selectBtn.click();
            }
        }
    }

    await new Promise(r => setTimeout(r, 2000));

    // 페이지 공개
    console.log('페이지 공개 중...');
    await page.click('.editor-post-publish-panel__toggle');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('.editor-post-publish-button');
    await new Promise(r => setTimeout(r, 3000));

    console.log('✓ 완료!');
    console.log('https://kimnhyunlaw.com 에서 확인하세요');

    await browser.close();
})();
