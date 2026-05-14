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

    // PDF URL 찾기
    console.log('PDF URL 확인...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/upload.php');
    await new Promise(r => setTimeout(r, 2000));

    // 첫 번째 미디어 클릭 (방금 업로드한 PDF일 것임)
    await page.click('.attachment:first-child');
    await new Promise(r => setTimeout(r, 2000));

    const pdfUrl = await page.evaluate(() => {
        return document.querySelector('#attachment-details-two-column-copy-link').value;
    });
    console.log('PDF URL:', pdfUrl);

    // 페이지 생성
    console.log('소개 페이지 생성...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php?post_type=page');
    await new Promise(r => setTimeout(r, 5000));

    // 제목
    await page.keyboard.type('김앤현 법률사무소 소개');
    await page.keyboard.press('Enter');

    // 내용 (HTML 모드로 입력하면 더 확실하지만, 그냥 텍스트와 링크로)
    await page.keyboard.type('이기는 부동산법, 김앤현 법률사무소입니다.');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await page.keyboard.type('소개서 다운로드: ');
    await page.keyboard.type(pdfUrl);
    await page.keyboard.press('Enter');

    // 공개
    await new Promise(r => setTimeout(r, 1000));
    const publishBtn = await page.$('.editor-post-publish-panel__toggle');
    if (publishBtn) {
        await publishBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        await page.click('.editor-post-publish-button');
    }

    console.log('✓ 페이지 생성 완료');

    await browser.close();
})();
