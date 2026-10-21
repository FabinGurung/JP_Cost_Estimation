/* Public-safe Finance source selector. Private workbook links are entered locally, never stored here. */
(() => {
  'use strict';
  const approved = 'https://docs.google.com/spreadsheets/d/1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE/edit';
  const pad = n => String(n).padStart(2,'0');
  const catalog = [
    {id:'FN-S01',label:'Rohini · Krishna Kumar Gupta payment register',public:true},
    {id:'FN-S02',label:'Rohini · Site Operations v1.4',public:false},
    {id:'FN-S03',label:'Fishtail · Daily and Monthly Spending Ledger',public:false},
    ...Array.from({length:21},(_,i)=>({id:'W'+pad(i+1),label:'Worker money and goods · original '+pad(i+1),public:false})),
    {id:'W01-V2',label:'Worker W01 · separate v2 prototype',public:false},
    {id:'FN-C01',label:'Site Engineer Capture Hub v0.1',public:false},
    {id:'FN-C02',label:'Historical handwritten site log intake',public:false}
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
    const workers = document.getElementById('workerSourceList');
    if(!form || !selector || !entry || !status || !frameWrap || !frame || !workers) return;
    for(const source of catalog) {
      const option = document.createElement('option');
      option.value=source.id;
      option.textContent=source.id+' · '+source.label;
      selector.appendChild(option);
    }
    for(let i=1;i<=21;i++) {
      const code='W'+pad(i);
      const card=document.createElement('div');
      card.className='jp-finance-worker';
      const name=document.createElement('strong');
      name.textContent=code;
      const note=document.createElement('small');
      note.textContent='Original workbook · access restricted';
      const button=document.createElement('button');
      button.type='button';
      button.textContent='Select '+code;
      button.addEventListener('click',()=>selectSource(code));
      card.append(name,note,button);
      workers.appendChild(card);
    }
    function selectSource(code) {
      if(!catalog.some(s=>s.id===code)) return;
      selector.value=code;
      entry.value='';
      entry.placeholder=code==='FN-S01'?'Approved source link available':'Paste authorized Google Sheet link';
      status.textContent=code+' selected. '+(code==='FN-S01'?'Use Preview to load the approved register.':'Paste the private Sheet URL from your authorized Drive account.');
      frame.src='about:blank';
      frameWrap.hidden=true;
      entry.focus();
    }
    for(const button of document.querySelectorAll('[data-finance-source]')) {
      button.addEventListener('click',()=>selectSource(button.getAttribute('data-finance-source')));
    }
    selector.addEventListener('change',()=>selectSource(selector.value));
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const source=catalog.find(s=>s.id===selector.value);
      if(!source)return;
      const input=entry.value.trim()||(source.public?approved:'');
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
    selectSource('FN-S01');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
