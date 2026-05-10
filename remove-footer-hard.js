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

    console.log('테마 파일 편집기 이동...');
    await page.goto('https://kimnhyunlaw.com/wp-admin/theme-editor.php');

    // 경고 팝업 처리 ("이해했습니다" 버튼)
    try {
        const understandBtn = await page.$('.notice-dismiss'); // 또는 실제 버튼 클래스
        if (understandBtn) await understandBtn.click();
    } catch (e) { }

    // Twenty Twenty-One 선택 확인
    // (기본적으로 활성 테마가 선택됨)

    console.log('footer.php 선택...');
    // 파일 목록에서 footer.php 찾기
    const footerLink = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('.wp-theme-editor-file-list a'));
        const footer = links.find(l => l.textContent.includes('footer.php') || l.textContent.includes('Theme Footer'));
        if (footer) {
            footer.click();
            return true;
        }
        return false;
    });

    if (!footerLink) {
        console.log('footer.php를 찾을 수 없습니다. 테마가 다른 것일 수 있습니다.');
        // Twenty Twenty-Two 같은 블록 테마라면 site-editor로 가야 함
    } else {
        await new Promise(r => setTimeout(r, 3000));

        console.log('코드 수정 중...');
        // 에디터 내용 가져오기
        await page.click('.CodeMirror');

        // "powered-by" 부분 삭제를 위해 전체 내용을 가져와서 수정 후 다시 입력
        // 하지만 CodeMirror 조작이 어려우므로, CSS로 다시 한번 강력하게 시도하거나
        // 파일 내용을 덮어쓰는 방식을 시도

        // 여기서는 CSS를 'Additional CSS'가 아닌 'style.css' 파일에 직접 추가하는 방식으로 우회
        console.log('style.css로 이동하여 강력한 CSS 추가...');
        const styleLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.wp-theme-editor-file-list a'));
            const style = links.find(l => l.textContent.includes('style.css') || l.textContent.includes('Stylesheet'));
            if (style) {
                style.click();
                return true;
            }
            return false;
        });

        if (styleLink) {
            await new Promise(r => setTimeout(r, 3000));

            // 파일 끝에 CSS 추가
            await page.evaluate(() => {
                const editor = document.querySelector('.CodeMirror').CodeMirror;
                const css = `
/* Hide Footer Credits */
.site-info, .powered-by, .footer-credits, .imprint {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
}
`;
                editor.setValue(editor.getValue() + css);
            });

            await new Promise(r => setTimeout(r, 1000));
            await page.click('#submit');
            await new Promise(r => setTimeout(r, 3000));
            console.log('✓ style.css에 숨김 코드 추가 완료');
        }
    }

    console.log('✓ 완료!');

    await browser.close();
})();
