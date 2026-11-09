/* Public-safe Finance source selector. Private workbook links are entered locally, never stored here. */
(() => {
  'use strict';
  // Finance only: source-backed payment and spending registers. The previous
  // worker/attendance/capture catalogue remains in Git history, not this UI.
  const catalog = [
    {id:'FN-S01',label:'Rohini · Krishna Kumar Gupta Project Payment Register',public:true},
    {id:'FN-S03',label:'Fishtail · Daily and Monthly Spending Ledger (private reference)',public:false}
  ];
  function safePreview(input) {
    try {
      const url = new URL(input);
      if(url.protocol!=='https:' || url.hostname!=='docs.google.com') return null;
      const match = url.pathname.match(/^\/spreadsheets\/d\/([A-Za-z0-9_-]+)(?:\/.*)?$/);
      if(!match) return null;
      const gid = url.searchParams.get('gid');
      return {
        preview:'https://docs.google.com/spreadsheets/d/'+match[1]+'/preview'+(gid && /^\d+$/.test(gid)?'?gid='+gid:''),
        original:'https://docs.google.com/spreadsheets/d/'+match[1]+'/edit'+(gid && /^\d+$/.test(gid)?'#gid='+gid:'')
      };
    } catch {return null;}
  }
  function init() {
    const form = document.getElementById('financeSheetForm');
    const selector = document.getElementById('financeSheetCode');
    const entry = document.getElementById('financeSheetUrl');
    const status = document.getElementById('financeSheetStatus');
    const frameWrap = document.getElementById('financeSheetFrame');
    const frame = document.getElementById('financeSheetIframe');
    const open = document.getElementById('financeSheetOpen');
    const clear = document.getElementById('financeSheetClear');
    if(!form || !selector || !entry || !status || !frameWrap || !frame) return;
    for(const source of catalog) {
      const option = document.createElement('option');
      option.value=source.id;
      option.textContent=source.id+' · '+source.label;
      selector.appendChild(option);
    }
    function selectSource(code, focus = true) {
      if(!catalog.some(s=>s.id===code)) return;
      selector.value=code;
      entry.value='';
      entry.placeholder=code==='FN-S01'?'Use the native Finance header view':'Paste authorized Google Sheet link';
      status.textContent=code+' selected. '+(code==='FN-S01'?'The approved register is available inside the Finance header above.':'Paste the private Sheet URL from your authorized Drive account.');
      frame.src='about:blank';
      frameWrap.hidden=true;
      if(focus) entry.focus();
    }
    for(const button of document.querySelectorAll('[data-finance-source]')) {
      button.addEventListener('click',()=>selectSource(button.getAttribute('data-finance-source')));
    }
    selector.addEventListener('change',()=>selectSource(selector.value));
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const source=catalog.find(s=>s.id===selector.value);
      if(!source)return;
      if(source.id==='FN-S01') {
        const native=document.getElementById('fnS01Native');
        if(!native){status.textContent='Native FN-S01 register view is unavailable.';return;}
        const details=native.querySelector('details');
        if(details) details.open=true;
        native.scrollIntoView({behavior:'smooth',block:'start'});
        status.textContent='FN-S01 is shown natively in the Finance header, with no Google Sheets frame.';
        frame.src='about:blank';
        frameWrap.hidden=true;
        return;
      }
      const input=entry.value.trim();
      if(!input){status.textContent='A private source URL is required. Nothing has been loaded.';frameWrap.hidden=true;return;}
      const target=safePreview(input);
      if(!target){status.textContent='Enter a valid https://docs.google.com/spreadsheets/d/... link.';frameWrap.hidden=true;return;}
      frame.title='Google Sheets preview for '+source.id;
      frame.src=target.preview;
      open.href=target.original;
      frameWrap.hidden=false;
      status.textContent='Opening '+source.id+' directly from Google Sheets. Google account permissions still apply; a preview may require opening the source in a new tab.';
    });
    clear.addEventListener('click',()=>{
      frame.src='about:blank';
      frameWrap.hidden=true;
      entry.value='';
      status.textContent='Preview cleared. No private source link is retained by this page.';
    });
    selectSource('FN-S01', false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
