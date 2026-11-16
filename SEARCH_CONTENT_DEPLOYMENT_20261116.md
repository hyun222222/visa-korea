# 비자 검색 콘텐츠 반영 · 2026-11-16

이 문서는 운영 관리용이며 웹페이지/사이트맵에 포함하지 않는다.

## 기준과 적용 내용

- 기준 원격: `hyun222222/visa-korea`, `main`의 `64b9d063d24a110cdb7a69936d057c8e698d9cc9`.
- 이전 D-8 판결 정정 및 30개 국·영·중·일문 법률 정정 스냅샷을 보존한다.
- `/blog`, 국문 의료비자·불허·유치 등록·SNS 광고 페이지, `/en`, 영문 D-8 기본 안내의 제목을 검토표에 맞춘다.
- 새 글 2주제를 국문·영문으로 작성했다. 공관 결혼사증 거절과 국내 체류 변경·연장 불허, 이의신청과 행정심판·소송의 기한을 구분했다.
- 새 글은 법률정보이며 김앤현의 승소사례로 표시하지 않는다. 검증된 소개 페이지, 전화 `010-5534-6843`와 카카오톡 `https://open.kakao.com/o/saviVYPi`로 연결한다.
- 운영 DB가 설정되어 있으면 DB가 유일한 게시 목록이다. 오류나 빈 목록에서 정적 글을 복원하지 않는다. 새 글의 공식 출처·수정일은 검토한 제목·요약·본문이 일치할 때만 붙인다. 관리자 편집은 덮어쓰지 않는다.

## 게시 대상 주소

1. `/blog/deportation-order-objection`
2. `/en/blog/deportation-order-objection-en`
3. `/blog/f6-marriage-visa-refusal-reapplication`
4. `/en/blog/f6-marriage-visa-refusal-reapplication-en`

원고 데이터는 `lib/search-articles-20261116.json`이다. 두 언어가 같은 base slug를 사용하여 기존 hreflang 생성 방식과 호환된다. sitemap과 홈의 새 글 안내는 운영 CMS에 실제 존재하는 글만 연결한다.

## 검증

- `node --experimental-strip-types --test tests/d8-search.test.mjs tests/legal-review.test.mjs tests/search-content.test.mjs`: 11개 통과.
- `npm run build`: 성공, 타입 검사 성공.
- `npx eslint lib/search-content-review.ts components/ContactActions.tsx components/blog/PublishedDecisionGuides.tsx scripts/publish-search-articles.mjs tests/search-content.test.mjs`: 성공.
- `node scripts/verify-search-html.mjs`: 로컬 14개 화면 200; 새 글 4편의 canonical, 국영문 hreflang, Article 공식 출처와 수정일, 사이트맵 URL 확인. 국영중일 홈에 전화·카카오톡 버튼 확인.
- 로컬 검증은 운영 게시·검색 색인·순위 상승의 확인을 뜻하지 않는다.

## 운영 반영 절차

상속 → 부동산 → 비자 순차 반영 승인 신호 후 실행한다. 이 작업본에서는 push/DB write/운영 배포를 아직 실행하지 않았다.

1. 정상 기존 Vercel 인증으로 비자 프로젝트를 확인하고 운영 환경을 비공개 임시 파일에 받는다. 토큰과 키를 터미널/문서/공개 소스에 출력하지 않는다. 2026-11-16 현재 `vercel whoami`는 저장 로그인 만료를 반환했다.
2. 정상 관리자 권한 또는 기존 service-role 환경값을 사용한다. 프로젝트는 `amqnssakcqsdeeunrtfz.supabase.co`로 스크립트에서 고정 검증한다. 공개 anon 키만으로 쓰기 정책을 바꾸거나 우회하지 않는다.
3. `node scripts/publish-search-articles.mjs --plan`: 해당 4개 slug만 읽고 `publication-backups/`에 원본·누락 목록을 저장한다. 기존 내용이 원고와 다르면 중단한다. 키는 환경변수에서만 읽는다.
4. 검증된 원격 최신 main과 충돌이 없는지 확인하고 본 변경을 push하여 Vercel 운영 빌드를 기다린다. DB와 관리자 동작을 변경하는 migration은 실행하지 않는다.
5. `node scripts/publish-search-articles.mjs --publish <plan에서 만든 백업경로>`: 4개 slug 중 없는 글만 insert-if-absent upsert. 기존 글과 편집 내용은 덮어쓰지 않는다. 같은 요청 반복은 중복 글을 만들지 않는다. 삽입한 row ID를 별도 receipt에 저장한다.
6. `node scripts/verify-search-html.mjs https://koreavisalaw.com`: 운영 14개 화면 및 새 글 4편을 검사한다. 영문 D-8 기본 안내는 별도로 제목과 판결 정정·출처 유지 여부를 검사한다. sitemap 재생성 시간도 확인한다.
7. 공개 확인 이후에만 새 주소 4개의 검색 수집 갱신 필요성을 검토한다. 검색 등록·색인·검색 순위는 서로 다른 상태다.

## 롤백

`node scripts/publish-search-articles.mjs --rollback <백업경로>`는 해당 실행에서 실제 새로 삽입했다고 기록된 row ID만 대상으로 한다. 관리자 후속 편집(updated_at 또는 내용 변화)이 있으면 자동 삭제하지 않고 중단한다. 기존에 존재하던 글은 보존한다. 코드 롤백은 이 변경 커밋만 revert하고 이전 법률 정정 커밋을 되돌리지 않는다.

백업 디렉터리는 gitignore에 포함된다. 백업·환경 파일은 `public/`에 두거나 Git에 올리지 않는다.
