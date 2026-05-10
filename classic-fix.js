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

    // 1. Classic Editor 설치
    console.log('Classic Editor 설치...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/plugin-install.php?s=classic+editor&tab=search&type=term');
    await new Promise(r => setTimeout(r, 3000));

    const installBtn = await page.$('.plugin-card-classic-editor .install-now');
    if (installBtn) {
        await installBtn.click();
        await new Promise(r => setTimeout(r, 5000));
        const activateBtn = await page.$('.plugin-card-classic-editor .activate-now');
        if (activateBtn) {
            await activateBtn.click();
            await page.waitForNavigation();
        }
    }

    // 2. 카테고리 생성 (확실하게)
    console.log('카테고리 생성...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/edit-tags.php?taxonomy=category');
    const categories = [
        '건축/건설', '경매', '계약/해약금', '공유물분할', '농지/토지/임야',
        '명의신탁', '부동산 세금', '부동산 최신 판결', '부동산 형사 고소',
        '분양 계약', '상가 임대차', '임대차/전세', '재개발/재건축', '지주택', '김앤현 부동산소개'
    ];

    for (const cat of categories) {
        await page.type('#tag-name', cat);
        await page.click('#submit');
        await new Promise(r => setTimeout(r, 200));
    }

    // 3. 환영 글 작성 (Classic Editor)
    console.log('환영 글 작성 (Classic)...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/post-new.php');
    await new Promise(r => setTimeout(r, 2000));

    await page.type('#title', '김앤현 법률사무소 블로그를 시작합니다.');
    await page.click('#content-html'); // 텍스트 모드
    await page.type('#content', '이기는 부동산법, 김앤현 법률사무소입니다.\n\n부동산 관련 최신 판결과 법률 정보를 전해드립니다.');

    // 카테고리 선택 (김앤현 부동산소개)
    await page.evaluate(() => {
        const catLabels = Array.from(document.querySelectorAll('#category-all label'));
        const target = catLabels.find(l => l.textContent.includes('김앤현 부동산소개'));
        if (target) target.click();
    });

    // 공개
    await page.click('#publish');
    await page.waitForNavigation();
    console.log('✓ 글 작성 완료');

    console.log('✓ 모든 작업 완료!');

    await browser.close();
})();
