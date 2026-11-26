import {visaOrigin} from './brand';
import type {KoreanReviewTopic} from './visa-review-ko-topics';

type ReadingLink = {label: string; url: string};
type GuideLinks = {sources: ReadingLink[]; related: ReadingLink};

const longStay = {
  label: '출입국관리법 시행령 별표 1의2 · 장기체류자격 (PDF)',
  url: 'https://www.law.go.kr/flDownload.do?flSeq=169296535',
};
const workplace = {
  label: '출입국관리법 제21조 · 근무처의 변경·추가',
  url: 'https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031822861',
};
const residenceManual = {
  label: '하이코리아 · 체류자격별 통합 안내 매뉴얼',
  url: 'https://www.hikorea.go.kr/board/BoardNtcDetailR.pt?BBS_SEQ=1&BBS_GB_CD=BS10&NTCCTT_SEQ=1062&page=1',
};
const e7Guide = {
  label: '법무부 취업비자 E-7·E-7-4 안내 길잡이',
  url: 'https://www.immigration.go.kr/sites/immigration/file/e7guide.html',
};
const changingJobs = {
  label: 'E-7 고용 종료 후 이직과 D-10 변경 때 확인할 자료 (영어)',
  url: visaOrigin + '/en/blog/e7-termination-d10-en',
};
const permanentResidence = {
  label: '영주자격 신청 시 유형별로 확인할 생계유지·품행·기본소양 요건',
  url: visaOrigin + '/blog/f5-permanent-residency',
};

export const guideLinks: Record<KoreanReviewTopic, GuideLinks> = {
  'e7-job-loss': {
    sources: [workplace, {
      label: '출입국관리법 제24조 · 체류자격 변경허가',
      url: 'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031816861',
    }, e7Guide],
    related: changingJobs,
  },
  'e7-visa': {
    sources: [e7Guide, {
      label: '법무부 2026년 특정활동(E-7) 체류자격 임금요건 기준 공고 (PDF)',
      url: 'https://www.immigration.go.kr/bbs/immigration/211/488810/download.do',
    }, workplace],
    related: {label: 'E-7-4 숙련기능인력 전환과 고용한도', url: visaOrigin + '/blog/e7-skilled-worker'},
  },
  'd10-visa': {
    sources: [residenceManual, longStay, {
      label: '출입국관리법 제20조 · 체류자격 외 활동',
      url: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1035220467',
    }],
    related: changingJobs,
  },
  'd8-visa': {
    sources: [longStay, {
      label: '외국인투자 촉진법 시행령 제2조 · 외국인투자의 정의',
      url: 'https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000847964',
    }, {
      label: '대구지방법원 2012구합29 · 체류자격변경불허처분취소',
      url: 'https://www.law.go.kr/LSW/precInfoP.do?precSeq=167380',
    }],
    related: {label: '외국인투자기업 등록 후 D-8 불허 사건에서 법원이 살핀 자료', url: visaOrigin + '/blog/d8-visa-rejection-reasons'},
  },
  'f2-7-visa': {
    sources: [residenceManual, longStay, {
      label: '법무부 거주(F-2) 자목의 연령·학력·소득 등 기준 고시',
      url: 'https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000266296',
    }],
    related: {label: 'F-2-7 점수를 뒷받침하는 신청 자료', url: visaOrigin + '/blog/f2-points-system'},
  },
  'f4-visa': {
    sources: [{
      label: '재외동포법 제5조 · 재외동포체류자격의 부여',
      url: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032646167',
    }, {
      label: '법무부 동포 체류자격(F-4) 통합 시행 안내',
      url: 'https://www.immigration.go.kr/bbs/moj/182/603456/artclView.do',
    }],
    related: permanentResidence,
  },
  'f5-visa': {
    sources: [{
      label: '출입국관리법 제10조의3 · 영주자격',
      url: 'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1028070161',
    }, {
      label: '출입국관리법 시행규칙 제18조의4 · 영주자격 취득 요건의 기준·범위',
      url: 'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=04&joNo=0018&lsiSeq=289833&urlMode=lsScJoRltInfoR',
    }],
    related: permanentResidence,
  },
  reentry: {
    sources: [{
      label: '출입국관리법 제11조 · 입국의 금지 등',
      url: 'https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031822917',
    }, {
      label: '출입국관리법 제60조 · 강제퇴거명령에 대한 이의신청',
      url: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1000822941',
    }],
    related: {label: '강제퇴거명령서를 받았을 때 확인할 기한과 절차', url: visaOrigin + '/blog/deportation-order-objection'},
  },
  'visa-refusal': {
    sources: [{
      label: '대법원 2014두42506 · 결혼이민(F-6) 사증 거부',
      url: 'https://www.law.go.kr/precInfoP.do?precSeq=196008',
    }, {
      label: '대법원 2017두38874 · 재외동포(F-4) 사증 거부',
      url: 'https://www.law.go.kr/precInfoP.do?precSeq=208725',
    }, {
      label: '주태국 대한민국 대사관 · 사증 불허 후 재신청 안내',
      url: 'https://overseas.mofa.go.kr/th-ko/brd/m_28336/view.do?seq=10',
    }],
    related: {label: 'F-6 사증 재신청 기간과 예외', url: visaOrigin + '/blog/f6-marriage-visa-refusal-reapplication'},
  },
  'visa-status-check': {
    sources: [{
      label: '대한민국 비자포털 · 신청 진행현황 조회 및 출력',
      url: 'https://www.visa.go.kr/openPage.do?MENU_ID=10301',
    }, {
      label: 'K-ETA · 신청 수수료 안내',
      url: 'https://www.k-eta.go.kr/portal/guide/viewetafeeinformation.do',
    }, {
      label: '법무부 전자입국신고 · 신고 대상 안내',
      url: 'https://www.e-arrivalcard.go.kr/portal/guide/eacTargetGuide.do',
    }],
    related: {label: '출입국 보완 요청이나 불허 통지를 받은 경우', url: visaOrigin + '/blog/responding-to-immigration-rfe-and-refusal'},
  },
};
