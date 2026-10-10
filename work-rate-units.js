/* v0.5.6 exact SI/Imperial rate denominator conversions; canonical NPR/SI observations unchanged. */
(function(root){
 'use strict';
 const factor=Object.freeze({
  'm²':{unit:'ft²',multiplier:0.3048**2,formula:'NPR/ft² = NPR/m² × 0.09290304'},
  'm³':{unit:'ft³',multiplier:0.3048**3,formula:'NPR/ft³ = NPR/m³ × 0.028316846592'},
  'm':{unit:'ft',multiplier:0.3048,formula:'NPR/ft = NPR/m × 0.3048'},
  'running m':{unit:'r.ft.',multiplier:0.3048,formula:'NPR/r.ft. = NPR/r.m. × 0.3048'},
  'kg':{unit:'lb',multiplier:0.45359237,formula:'NPR/lb = NPR/kg × 0.45359237'}
 });
 const fmt=new Intl.NumberFormat('en-IN',{maximumFractionDigits:2});
 function normalize(text){
  return String(text??'').normalize('NFKD').toLocaleLowerCase('en')
   .replace(/[\u0300-\u036f]/g,'').replace(/\u00b2/g,'2').replace(/\u00b3/g,'3')
   .replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
 }
 function match(haystack,query){
  const q=normalize(query);if(!q)return true;
  const h=normalize(haystack);
  return h.includes(q)||h.replace(/ /g,'').includes(q.replace(/ /g,''));
 }
 function convert(rate,unit,mode){
  if(!Number.isFinite(rate)||rate<0)throw Error('Invalid source rate');
  const f=factor[unit];
  if(mode==='imperial'&&f)return {rate:rate*f.multiplier,unit:f.unit,derived:true,formula:f.formula,originalRate:rate,originalUnit:unit};
  return {rate,unit:unit==='running m'?'r.m.':unit,derived:false,formula:null,originalRate:rate,originalUnit:unit};
 }
 function rateText(rate,unit,mode){const x=convert(rate,unit,mode);return {...x,formatted:fmt.format(x.rate)};}
 function preferred(){try{const q=new URLSearchParams(root.location?.search??'').get('units');if(q==='si'||q==='imperial')return q;return root.localStorage?.getItem('jp-rate-display-units')==='imperial'?'imperial':'si';}catch(e){return 'si';}}
 function save(mode){try{root.localStorage?.setItem('jp-rate-display-units',mode);}catch(e){}}
 root.JPRateUnits=Object.freeze({factor,normalize,match,convert,rateText,preferred,save});
})(typeof window!=='undefined'?window:globalThis);
