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

    console.log('\n=== "김앤현 법률사무소 소개" 페이지 생성 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php?post_type=page');
    await new Promise(r => setTimeout(r, 5000));

    // Block Editor 대신 Classic Editor 활성화
    console.log('Classic Editor로 전환 시도...');
    const classicBtn = await page.$('button[aria-label="Block editor"]');

    // 제목 입력 (Block Editor의 경우)
    try {
        await page.waitForSelector('h1.editor-post-title__input, textarea.editor-post-title__input', { timeout: 3000 });
        const titleInput = await page.$('h1.editor-post-title__input, textarea.editor-post-title__input');
        if (titleInput) {
            await titleInput.type('김앤현 법률사무소 소개');
            console.log('✓ 제목 입력');
        }
    } catch (e) {
        console.log('Block Editor 제목 입력 실패, 다른 방법 시도...');
    }

    await new Promise(r => setTimeout(r, 2000));

    // 콘텐츠 영역 클릭
    try {
        const contentArea = await page.$('.block-editor-writing-flow, .block-editor-block-list__layout');
        if (contentArea) {
            await contentArea.click();
            await new Promise(r => setTimeout(r, 500));

            // 소개 텍스트 입력
            await page.keyboard.type('### 대한변호사협회 인증 부동산전문변호사');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Enter');
            await page.keyboard.type('김앤현 법률사무소는 부동산 전문 법률사무소입니다.');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Enter');

            console.log('✓ 내용 입력');
        }
    } catch (e) {
        console.log('콘텐츠 입력 실패');
    }

    await new Promise(r => setTimeout(r, 2000));

    // 페이지 공개
    console.log('\n페이지 공개 중...');
    try {
        // 공개 버튼 찾기
        const publishBtn = await page.$('button.editor-post-publish-panel__toggle, button.editor-post-publish-button__button');
        if (publishBtn) {
            await publishBtn.click();
            await new Promise(r => setTimeout(r, 1500));

            // 최종 공개 버튼
            const finalPublishBtn = await page.$('button.editor-post-publish-button');
            if (finalPublishBtn) {
                await finalPublishBtn.click();
                await new Promise(r => setTimeout(r, 3000));
                console.log('✓ 페이지 공개 완료');
            }
        }
    } catch (e) {
        console.log('공개 버튼 클릭 시도 중...');
        // 대체 방법: Ctrl+S
        await page.keyboard.down('Control');
        await page.keyboard.press('S');
        await page.keyboard.up('Control');
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log('\n✓ 완료!');
    console.log('https://kimnhyunlaw.com 에서 확인하세요');

    await browser.close();
})();
