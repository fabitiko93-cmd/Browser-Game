// Save values remain accounting units; one unit represents one billion credits.
export const CREDIT_SCALE=1e9;
export const CREDIT_INPUT_UNIT='Mrd. ¢';
export function moneyAmount(value,{signed=false,compact=false}={}) {
  const n=Number(value)||0,absolute=Math.abs(n);
  const units=[[1e12,'Trd.'],[1e9,'Trio.'],[1e6,'Brd.'],[1000,'Bio.'],[1,'Mrd.'],[.001,'Mio.'],[.000001,'Tsd.']];
  const [divisor,unit]=absolute===0?[1,'Mrd.']:units.find(([limit])=>absolute>=limit)??[1/CREDIT_SCALE,''];
  const prefix=n<0?'−':signed?'+':'';
  const amount=(absolute/divisor).toLocaleString('de-DE',{maximumFractionDigits:compact?1:2});
  return `${prefix}${amount}${unit?' '+(compact?unit.replace('.',''):unit):''}`;
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
