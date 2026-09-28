export const airportContact = {
  whatsapp: 'https://wa.me/821055346843',
  // Add the office's verified public KakaoTalk URL when it is available.
  kakao: null as string | null,
  email: 'mailto:info@kimnhyun.com',
  phone: 'tel:+821055346843',
} as const;

export type AirportContactStage =
  | 'overview'
  | 'prepare'
  | 'login'
  | 'agreement'
  | 'payment'
  | 'documents'
  | 'availability';
