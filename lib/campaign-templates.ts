import { ShieldAlert, Building2, Landmark, ShoppingCart, LucideIcon } from "lucide-react";

export type CampaignCategory = 'data-leak' | 'apartment-defect' | 'state-liability' | 'consumer-damage';

export interface CampaignTemplate {
    id: CampaignCategory;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    borderColor: string;
    bgGradient: string;
    fields: CampaignField[];
    boardTabs: BoardTab[];
    visibility: 'public' | 'private';
}

export interface CampaignField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'multiselect';
    placeholder?: string;
    required: boolean;
    options?: string[];
}

export interface BoardTab {
    id: string;
    name: string;
    description: string;
}

export const CAMPAIGN_TEMPLATES: Record<CampaignCategory, CampaignTemplate> = {
    'data-leak': {
        id: 'data-leak',
        name: '개인정보 유출',
        description: '대규모 개인정보 유출 피해에 대한 집단 소송',
        icon: ShieldAlert,
        color: 'text-red-400',
        borderColor: 'border-red-500/30',
        bgGradient: 'bg-gradient-to-br from-red-500/10 to-red-600/5',
        visibility: 'public',
        fields: [
            {
                id: 'companyName',
                label: '유출 기업/사이트명',
                type: 'text',
                placeholder: '예: ABC 쇼핑몰',
                required: true
            },
            {
                id: 'leakDate',
                label: '유출 시점',
                type: 'date',
                required: true
            },
            {
                id: 'leakItems',
                label: '유출 항목',
                type: 'multiselect',
                required: true,
                options: ['이메일', '비밀번호', '주민등록번호', '전화번호', '주소', '결제정보', '기타']
            },
            {
                id: 'estimatedVictims',
                label: '예상 피해자 수',
                type: 'number',
                placeholder: '예: 50000',
                required: false
            }
        ],
        boardTabs: [
            { id: 'notice', name: '공지', description: '사건 개요 및 타임라인' },
            { id: 'verification', name: '피해 인증', description: '유출 확인 캡처 업로드' },
            { id: 'strategy', name: '법정손해배상 전략', description: '법정 vs 일반 손해배상 토론' }
        ]
    },

    'apartment-defect': {
        id: 'apartment-defect',
        name: '아파트 하자',
        description: '동일 단지 하자 담보 책임 청구',
        icon: Building2,
        color: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        bgGradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
        visibility: 'private',
        fields: [
            {
                id: 'apartmentName',
                label: '아파트/오피스텔명',
                type: 'text',
                placeholder: '예: 강남 자이 아파트',
                required: true
            },
            {
                id: 'builder',
                label: '시공사',
                type: 'text',
                placeholder: '예: GS건설',
                required: true
            },
            {
                id: 'moveInDate',
                label: '입주 연월',
                type: 'date',
                required: true
            },
            {
                id: 'address',
                label: '주소',
                type: 'text',
                placeholder: '서울시 강남구...',
                required: true
            },
            {
                id: 'defectType',
                label: '하자 유형',
                type: 'multiselect',
                required: true,
                options: ['누수', '균열', '방음', '난방', '환기', '마감불량', '기타']
            }
        ],
        boardTabs: [
            { id: 'authentication', name: '등기부 인증', description: '등기부등본/분양계약서 인증' },
            { id: 'gallery', name: '하자 사진첩', description: '부위별 사진 수집 (공용부/전유부)' },
            { id: 'voting', name: '진단업체 투표', description: '입주자대표회의/진단업체 선정' }
        ]
    },

    'state-liability': {
        id: 'state-liability',
        name: '국가 배상',
        description: '영조물 하자 또는 공무원 과실로 인한 손해배상',
        icon: Landmark,
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgGradient: 'bg-gradient-to-br from-amber-500/10 to-amber-600/5',
        visibility: 'public',
        fields: [
            {
                id: 'accidentType',
                label: '사고 유형',
                type: 'select',
                required: true,
                options: ['영조물 하자 (시설물 결함)', '공무원 과실 (직무상 잘못)']
            },
            {
                id: 'occurredAt',
                label: '사고 발생 일시',
                type: 'date',
                required: true
            },
            {
                id: 'location',
                label: '사고 장소',
                type: 'text',
                placeholder: '예: 서울시 종로구 세종대로',
                required: true
            },
            {
                id: 'authority',
                label: '관할 지자체/기관',
                type: 'text',
                placeholder: '예: 서울시청',
                required: true
            }
        ],
        boardTabs: [
            { id: 'guide', name: '배상심의회 안내', description: '배상심의회 신청 절차' },
            { id: 'archive', name: '증거 아카이브', description: 'CCTV/블랙박스/녹취록 공유' },
            { id: 'disclosure', name: '정보공개청구', description: '기관 답변서 공유' }
        ]
    },

    'consumer-damage': {
        id: 'consumer-damage',
        name: '소비자 집단 피해',
        description: '환불/손해배상 목적의 집단 분쟁조정',
        icon: ShoppingCart,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgGradient: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
        visibility: 'public',
        fields: [
            {
                id: 'productName',
                label: '상품/서비스명',
                type: 'text',
                placeholder: '예: 갤럭시 S25',
                required: true
            },
            {
                id: 'company',
                label: '제조/판매사',
                type: 'text',
                placeholder: '예: 삼성전자',
                required: true
            },
            {
                id: 'damageType',
                label: '피해 유형',
                type: 'select',
                required: true,
                options: ['먹튀 (환불 거부)', '불량품 (제품 결함)', '허위광고', '개인정보 무단수집', '기타']
            },
            {
                id: 'purchaseDate',
                label: '구매/결제일',
                type: 'date',
                required: true
            },
            {
                id: 'damageAmount',
                label: '개인 피해액 (원)',
                type: 'number',
                placeholder: '예: 500000',
                required: false
            }
        ],
        boardTabs: [
            { id: 'dashboard', name: '피해액 집계', description: '총 피해액 실시간 대시보드' },
            { id: 'action', name: '내용증명 릴레이', description: '발송 인증 게시판' },
            { id: 'recruitment', name: '집단조정 신청', description: '한국소비자원 신청자 명부' }
        ]
    }
};
