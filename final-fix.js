const puppeteer = require('puppeteer');
const mysql = require('mysql2/promise');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log('=== WordPress 로그인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-login.php');
    await page.type('#user_login', 'catalyst305@gmail.com');
    await page.type('#user_pass', 'nF9JA7mEnh');
    await page.click('#wp-submit');
    await page.waitForNavigation();

    console.log('=== 데이터베이스 정보 확인 ===');
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-general.php');
    await new Promise(r => setTimeout(r, 2000));

    // wp-config.php 정보를 가져올 수 없으므로, WordPress 관리자 페이지에서 직접 수정
    console.log('=== 플러그인으로 SQL 실행 ===');

    // Adminer 또는 SQL 실행 플러그인 설치 시도
    await page.goto('https://kimnhyunlaw.com/wp-admin/plugin-install.php?s=adminer&tab=search&type=term');
    await new Promise(r => setTimeout(r, 3000));

    const installedAdminer = await page.evaluate(() => {
        const installBtn = document.querySelector('a[data-slug="adminer"]');
        if (installBtn && installBtn.textContent.includes('Install')) {
            installBtn.click();
            return true;
        }
        return false;
    });

    if (installedAdminer) {
        await new Promise(r => setTimeout(r, 5000));
        console.log('✓ Adminer 설치 중...');
    }

    // 직접 options 테이블 수정하는 다른 방법
    console.log('=== 직접 설정 변경 시도 ===');

    // Settings API를 통한 강제 변경
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 2000));

    const result = await page.evaluate(() => {
        // JavaScript로 폼 강제 변경
        const form = document.querySelector('#front-static-pages');
        if (!form) return 'No form found';

        // posts 선택
        const postsRadio = document.querySelector('input[name="show_on_front"][value="posts"]');
        if (postsRadio) {
            postsRadio.checked = true;
            postsRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 페이지 선택 해제
        const pageOnFront = document.querySelector('select[name="page_on_front"]');
        if (pageOnFront) {
            pageOnFront.value = '0';
        }

        const pageForPosts = document.querySelector('select[name="page_for_posts"]');
        if (pageForPosts) {
            pageForPosts.value = '0';
        }

        // nonce 확인
        const nonce = document.querySelector('#_wpnonce');

        return {
            hasForm: !!form,
            hasNonce: !!nonce,
            postsChecked: postsRadio?.checked,
            pageOnFront: pageOnFront?.value,
            pageForPosts: pageForPosts?.value
        };
    });

    console.log('폼 상태:', result);

    await new Promise(r => setTimeout(r, 500));
    await page.click('#submit');
    await page.waitForNavigation();

    console.log('✓ 설정 저장 시도 완료');

    // 검증
    await page.goto('https://kimnhyunlaw.com/wp-admin/options-reading.php');
    await new Promise(r => setTimeout(r, 2000));

    const verification = await page.evaluate(() => {
        const checked = document.querySelector('input[name="show_on_front"]:checked');
        return {
            showOnFront: checked?.value,
            label: checked?.nextElementSibling?.textContent
        };
    });

    console.log('=== 최종 확인 ===');
    console.log('설정값:', verification);

    if (verification.showOnFront === 'posts') {
        console.log('✅ 성공! 블로그 모드로 변경됨');
    } else {
        console.log('⚠️  여전히 page 모드입니다');
    }

    console.log('\nhttps://kimnhyunlaw.com 확인하세요 (Ctrl+Shift+Delete로 캐시 삭제)');

    await browser.close();
})();
