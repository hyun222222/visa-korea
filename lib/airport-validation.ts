export const AIRPORT_PRICE = '3300.00';
export const AIRPORT_CODES = ['ICN','GMP','PUS','CJU','TAE','CJJ','MWX','YNY'];
export type AirportDetails = {traveler:string; signer:string; role:string; authority:boolean; airport:string; stage:string; returnAt:string; unknownReturn:boolean; contact:string; language:string; purpose:string; relatedParties:string; signature:string; consent:boolean; privacyConsent:boolean; sensitiveConsent:boolean; lang:'ko'|'en'};
export function validateDetails(raw:unknown, now=Date.now()):AirportDetails {
  if (!raw || typeof raw!=='object') throw new Error('Invalid application');
  const d=raw as AirportDetails;
  for (const key of ['traveler','signer','contact','purpose','relatedParties','signature'] as const) {
    if (typeof d[key]!=='string' || !d[key].trim() || d[key].length>1000) throw new Error('Complete all required fields');
    d[key]=d[key].trim();
  }
  if (!['ko','en'].includes(d.lang) || !['ko','en'].includes(d.language) || !AIRPORT_CODES.includes(d.airport) || !['inspection','refused','return'].includes(d.stage)) throw new Error('This package is for current Korean airport cases in Korean or English');
  if (!['self','representative'].includes(d.role) || d.authority!==true || d.consent!==true || d.privacyConsent!==true || d.sensitiveConsent!==true || d.signer!==d.signature) throw new Error('Signature and consent are required');
  if (d.role==='self' && d.signer!==d.traveler) throw new Error('Traveler and signer must match');
  if(d.unknownReturn!==true){
    const time=Date.parse(d.returnAt);
    if(!Number.isFinite(time)||time-now<2*60*60*1000) throw new Error('Return is less than two hours away; online intake is unavailable');
  }
  return Object.fromEntries(Object.entries(d).filter(([key])=>['traveler','signer','role','authority','airport','stage','returnAt','unknownReturn','contact','language','purpose','relatedParties','signature','consent','privacyConsent','sensitiveConsent','lang'].includes(key))) as AirportDetails;
}
export function validUpload(name:string,type:string,size:number){
  return size>0 && size<=10*1024*1024 && ({'application/pdf':/\.pdf$/i,'image/jpeg':/\.jpe?g$/i,'image/png':/\.png$/i}[type]?.test(name)??false);
}
