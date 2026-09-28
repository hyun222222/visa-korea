export const airportContact = {
  whatsapp: 'https://wa.me/821055346843',
  kakaoId: 'kimnhyunlaw',
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
