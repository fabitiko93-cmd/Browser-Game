// Display the same credit amounts that are stored and actually booked.
export const CREDIT_INPUT_UNIT='¢';
export function moneyAmount(value,{signed=false,compact=false}={}) {
  const n=Number(value)||0,absolute=Math.abs(n);
  const prefix=n<0?'−':signed?'+':'';
  return prefix+absolute.toLocaleString('de-DE',{maximumFractionDigits:compact?1:2});
}
export const money=(value,options)=>`${moneyAmount(value,options)} ¢`;
function accountingNumber(text) {
  const clean=text.replace(/[+−-]/g,'');
  const n=clean.includes(',')?Number(clean.replaceAll('.','').replace(',','.')):Number(/^\d{1,3}(?:\.\d{3})+$/.test(clean)?clean.replaceAll('.',''):clean);
  return /^[−-]/.test(text)?-n:n;
}
// Labels/messages are formatted at display time, including old saved messages.
export function moneyText(text) {
  return String(text).replace(/([+−-]?\d+(?:[.,]\d+)*)(\s*)(?:¢|Credits?\b)/giu,(match,number)=>money(accountingNumber(number),{signed:number.startsWith('+')}));
}
export const moneyMarkup=html=>String(html).replace(/(^|>)([^<]*)(?=<|$)/g,(_,start,content)=>start+moneyText(content));
