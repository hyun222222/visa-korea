// Keep disabled until the merchant, fixed price, scope and refund terms are approved.
// Never store a PayPal password or API secret in this file.
export const entryPayment = {
  enabled: false,
  checkoutUrl: '',
  displayPrice: 'USD 3,300',
  duration: {ko: '변호사 업무 최대 3시간', en: 'Up to 3 hours of attorney work'},
  languages: {ko: '', en: ''},
  delivery: {ko: '', en: ''},
  refundTerms: {ko: '', en: ''},
};

export function paymentReady(config = entryPayment): boolean {
  if (!config.enabled || !config.displayPrice || !['ko','en'].every(lang => {
    const l=lang as 'ko'|'en';
    return config.duration[l] && config.languages[l] && config.delivery[l] && config.refundTerms[l];
  })) return false;
  try {
    const url = new URL(config.checkoutUrl);
    return url.protocol === 'https:' && url.hostname === 'www.paypal.com' &&
      /^\/ncp\/payment\/[A-Za-z0-9]+\/?$/.test(url.pathname) && !url.username && !url.password && !url.port && !url.search && !url.hash;
  } catch {return false;}
}
