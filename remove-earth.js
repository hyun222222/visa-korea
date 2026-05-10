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

    console.log('사용자 정의하기(Customizer) 진입...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/customize.php?autofocus[section]=title_tagline');
    await new Promise(r => setTimeout(r, 5000));

    // 로고 삭제
    console.log('로고 확인 및 삭제...');
    const logoRemoved = await page.evaluate(() => {
        const removeBtn = document.querySelector('.remove-button');
        if (removeBtn) {
            removeBtn.click();
            return true;
        }
        return false;
    });

    if (logoRemoved) {
        console.log('✓ 로고 이미지(EARTH) 삭제됨');
    } else {
        console.log('설정된 로고 없음');
    }

    // 사이트 제목 확인 및 수정
    console.log('사이트 제목 수정...');
    await page.evaluate(() => {
        // 제목 입력
        const titleInput = document.querySelector('#_customize-input-blogname');
        if (titleInput) {
            titleInput.value = '김앤현 법률사무소';
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 태그라인(설명) 입력
        const descInput = document.querySelector('#_customize-input-blogdescription');
        if (descInput) {
            descInput.value = '이기는 부동산법 김앤현법률사무소';
            descInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // "사이트 제목 표시" 체크
        const titleCheck = document.querySelector('#_customize-input-header_text');
        if (titleCheck && !titleCheck.checked) {
            titleCheck.click();
        }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 저장 및 발행
    console.log('저장 중...');
    const saveBtn = await page.$('#save');
    if (saveBtn) {
        await saveBtn.click();
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log('✓ 완료! EARTH가 사라지고 김앤현 법률사무소가 보일 것입니다.');

    await browser.close();
})();
