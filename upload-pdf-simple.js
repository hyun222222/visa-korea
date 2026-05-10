const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('WordPress 로그인...');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('\nPDF 업로드 중...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/media-new.php');
    await new Promise(r => setTimeout(r, 3000));

    const fileInput = await page.$('#async-upload');
    const pdfPath = path.resolve('C:\\Projects\\anti\\김앤현-부동산소개.pdf');

    await fileInput.uploadFile(pdfPath);
    console.log('✓ 파일 선택 완료');

    // 업로드 대기
    await new Promise(r => setTimeout(r, 8000));

    console.log('\n미디어 라이브러리에서 URL 확인...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/upload.php');
    await new Promise(r => setTimeout(r, 3000));

    const pdfUrl = await page.evaluate(() => {
        const firstItem = document.querySelector('.attachment');
        if (firstItem) {
            firstItem.click();
            return true;
        }
        return false;
    });

    await new Promise(r => setTimeout(r, 2000));

    const url = await page.evaluate(() => {
        const urlInput = document.querySelector('.attachment-details-copy-link input');
        return urlInput ? urlInput.value : null;
    });

    console.log(`✓ PDF URL: ${url || '확인 필요'}`);

    console.log('\n완료! 이제 "변호사 소개" 페이지를 만들겠습니다.');
    console.log('PDF가 업로드되었습니다.');

    await browser.close();

    console.log('\n=== 다음 단계 ===');
    console.log('페이지 생성을 위해 다른 스크립트를 실행합니다...');
})();
