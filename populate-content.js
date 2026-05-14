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

    // 1. 카테고리 생성
    console.log('카테고리 생성 중...');
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
    console.log('✓ 15개 카테고리 생성 완료');

    // 2. "미분류" 카테고리 이름 변경
    console.log('미분류 카테고리 수정...');
    await page.evaluate(() => {
        const uncategorized = document.querySelector('a.row-title[aria-label*="미분류"]'); // 한글 WP
        if (uncategorized) uncategorized.click();
        else {
            // 영어 WP일 경우
            const uncategorizedEn = document.querySelector('a.row-title[aria-label*="Uncategorized"]');
            if (uncategorizedEn) uncategorizedEn.click();
        }
    });

    try {
        await page.waitForSelector('#name', { timeout: 3000 });
        await page.evaluate(() => {
            document.querySelector('#name').value = '공지사항';
            document.querySelector('#slug').value = 'notice';
        });
        await page.click('#submit');
        await page.waitForNavigation();
        console.log('✓ 미분류 -> 공지사항 변경 완료');
    } catch (e) {
        console.log('미분류 카테고리 찾지 못함 (이미 변경됨?)');
    }

    // 3. 환영 글 작성
    console.log('환영 글 작성...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php');
    await new Promise(r => setTimeout(r, 3000));

    // 제목
    await page.keyboard.type('김앤현 법률사무소 블로그입니다.');
    await page.keyboard.press('Enter');

    // 내용
    await page.keyboard.type('이기는 부동산법, 김앤현 법률사무소입니다.');
    await page.keyboard.press('Enter');
    await page.keyboard.type('부동산 관련 최신 판결과 법률 정보를 전해드립니다.');

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

    // 4. 푸터 숨기기 (강력한 CSS)
    console.log('푸터 숨기기 (CSS)...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/customize.php?autofocus[section]=custom_css');
    await new Promise(r => setTimeout(r, 5000));

    await page.evaluate(() => {
        const css = `
      .site-info { display: none !important; }
      .powered-by { display: none !important; }
      .footer-credits { display: none !important; }
      #colophon .site-info { display: none !important; }
      footer .site-info { display: none !important; }
    `;

        const textarea = document.querySelector('.CodeMirror textarea');
        if (textarea) {
            textarea.value = css;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const plainTextarea = document.querySelector('#_customize-input-custom_css');
        if (plainTextarea) {
            plainTextarea.value = css;
            plainTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    // CodeMirror 직접 입력
    await page.keyboard.type('/* Hide Footer */ .site-info { display: none !important; }');

    await new Promise(r => setTimeout(r, 1000));
    const saveBtn = await page.$('#save');
    if (saveBtn) {
        await saveBtn.click();
        await new Promise(r => setTimeout(r, 3000));
    }
    console.log('✓ 푸터 숨김 완료');

    console.log('✓ 모든 작업 완료!');

    await browser.close();
})();
