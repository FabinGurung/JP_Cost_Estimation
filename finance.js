(() => {
  'use strict';
  const root = document.getElementById('financeContent');
  const heading = document.getElementById('companyHeading');
  const intro = document.getElementById('companySubheading');
  const selectors = Array.from(document.querySelectorAll('[data-company]'));
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE/edit';
  const companies = {
    rohini: { title:'Rohini Engineering and Builders Pvt. Ltd.', description:'Project-by-project Rohini payment records, not a consolidated cross-company ledger.',connected:true },
    fishtail: { title:'Fishtail Builders Pvt. Ltd.', description:'Fishtail is a separate organization. Its records are not inferred from Rohini transactions.',connected:false },
    other: { title:'Other organizations', description:'Each organization can be onboarded independently with its own source registers.',connected:false }
  };
  const fmt = n => new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(Number(n||0));
  const money = n => 'NPR ' + fmt(n);
  let summaryPromise;

  function el(tag, cls, text) {
    const item = document.createElement(tag);
    if(cls) item.className = cls;
    if(text !== undefined) item.textContent = text;
    return item;
  }
  function safeSummary(data) {
    const rows = data && data.rows;
    if(!data || !Array.isArray(rows) || rows.length !== 26 || !data.summary) throw new Error('Unexpected source snapshot');
    const amount = rows.reduce((s,r)=>s+Number(r.amount_npr||0),0);
    const qr = rows.reduce((s,r)=>s+Number(r.qr_npr||0),0);
    const discount = rows.reduce((s,r)=>s+Number(r.discount_npr||0),0);
    if(amount !== data.summary.amount_npr || qr !== data.summary.qr_npr ||
       discount !== data.summary.discount_recorded_npr || data.summary.entry_count !== rows.length) {
       throw new Error('Published summary reconciliation failed');
    }
    return data;
  }
  function loadSummary() {
    if(!summaryPromise) summaryPromise = fetch('finance-summary.json',{cache:'no-cache'})
      .then(r=>{if(!r.ok)throw new Error('Source snapshot unavailable');return r.json()})
      .then(safeSummary);
    return summaryPromise;
  }
  function renderSummary(data) {
    const mount = document.getElementById('financeDashboard');
    if(!mount) return;
    mount.textContent = '';
    const head = el('div','finance-summary-header');
    const caption = el('div');
    caption.appendChild(el('p','eyebrow','GOOGLE SHEETS · SOURCE-DERIVED SUMMARY'));
    caption.appendChild(el('h3','','Payment summary — 14 Bishal Paija'));
    caption.appendChild(el('p','','The 26 named rows below are reproduced from the workbook summary. The reported amount and QR totals were checked against its Total row.'));
    head.appendChild(caption);
    const open = el('a','finance-source-link','Open original Google Sheet ↗');
    open.href=sheetUrl;open.target='_blank';open.rel='noopener noreferrer';
    head.appendChild(open);
    mount.appendChild(head);
    const cards=el('div','finance-fact-grid');
    [
      ['Recorded amount',money(data.summary.amount_npr),'Sheet Total · Amount column'],
      ['QR charges',money(data.summary.qr_npr),'Sheet Total · QR column'],
      ['Recorded discount',money(data.summary.discount_recorded_npr),'Summed from listed discount cells'],
      ['Summary entries',fmt(data.summary.entry_count),'Individual named lines in source']
    ].forEach(([label,value,detail])=>{
      const card=el('article','finance-fact');
      card.appendChild(el('small','',label));card.appendChild(el('strong','',value));card.appendChild(el('span','',detail));cards.appendChild(card);
    });
    mount.appendChild(cards);
    const tools=el('div','finance-data-search');
    tools.appendChild(el('label','','Vendor / item register'));
    const search=el('input');search.type='search';search.placeholder='Search vendor or item…';
    search.setAttribute('aria-label','Search payment summary');
    tools.appendChild(search);mount.appendChild(tools);
    const wrap=el('div','table-wrap');
    const table=el('table','finance-data-table');
    const thead=el('thead');
    const tr=el('tr');
    ['ID','Vendor / purpose','Amount (NPR)','QR (NPR)','Discount (NPR)'].forEach(t=>tr.appendChild(el('th','',t)));
    thead.appendChild(tr);table.appendChild(thead);
    const tbody=el('tbody');table.appendChild(tbody);
    const tfoot=el('tfoot');const footer=el('tr');
    ['','SOURCE TOTAL',fmt(data.summary.amount_npr),fmt(data.summary.qr_npr),'—'].forEach((v,i)=>{
      const cell=el('td',i>1?'num':'',v);
      footer.appendChild(cell);
    });
    tfoot.appendChild(footer);table.appendChild(tfoot);wrap.appendChild(table);mount.appendChild(wrap);
    const counter=el('p','finance-asof');mount.appendChild(counter);
    function draw(filter) {
      tbody.textContent='';
      const list=data.rows.filter(r=>(r.name+' '+r.id).toLowerCase().includes(filter.toLowerCase()));
      list.forEach(r=>{
        const row=el('tr');
        [r.id,r.name,fmt(r.amount_npr),r.qr_npr===null?'—':fmt(r.qr_npr),r.discount_npr===null?'—':fmt(r.discount_npr)]
         .forEach((v,i)=>row.appendChild(el('td',i>1?'num':'',String(v))));
        tbody.appendChild(row);
      });
      if(!list.length){const empty=el('tr');const cell=el('td','','No entries match your search.');cell.colSpan=5;empty.appendChild(cell);tbody.appendChild(empty)}
      counter.textContent = 'Showing '+list.length+' of '+data.rows.length+' source rows · Snapshot '+data.snapshot_date+
        ' · Exact source: '+data.source.source_sheet+'!'+data.source.range+
        ' · Searching does not change the full-source totals.';
    }
    search.addEventListener('input',()=>draw(search.value.trim()));
    draw('');
    const chart=el('div','finance-rank-list');
    const top=[...data.rows].sort((a,b)=>b.amount_npr-a.amount_npr).slice(0,7);
    const max=top[0] ? top[0].amount_npr : 1;
    top.forEach(r=>{
      const line=el('div','finance-rank-item');
      const name=el('label','',r.name);name.title=r.name;line.appendChild(name);
      const track=el('div','rank-track');const bar=el('div','rank-bar');
      bar.style.width=(100*r.amount_npr/max).toFixed(2)+'%';track.appendChild(bar);line.appendChild(track);
      line.appendChild(el('span','',fmt(r.amount_npr)));
      chart.appendChild(line);
    });
    const chartSection=el('section','panel');
    chartSection.appendChild(el('h2','','Largest recorded summary amounts'));
    chartSection.appendChild(el('p','sub','Visual comparison from the same source snapshot, not an independent estimate.'));
    chartSection.appendChild(chart);
    mount.appendChild(chartSection);
    const disclaimer=el('div','finance-summary-note',
      'The Amount, QR and Discount columns are shown separately. The discount aggregate is derived from populated entries; the source Total row does not contain a discount total. No additional subtraction or payment-netting is assumed. This is a source snapshot, not live synchronization. The linked Google Sheet remains the editable authority.');
    mount.appendChild(disclaimer);
  }
  function render(key){
    const company=companies[key] || companies.rohini;
    heading.textContent=company.title;intro.textContent=company.description;
    selectors.forEach(b=>{const active=b.dataset.company===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
    root.textContent='';
    if(!company.connected){
      const section=el('section','finance-empty');
      section.appendChild(el('h3','','A separate company workspace'));
      section.appendChild(el('p','',company.description+' No Rohini payment amounts have been assigned here.'));
      root.appendChild(section);return;
    }
    const crumb=el('div','finance-breadcrumb');
    ['Rohini','›','14_Bishal_Paija','›','Payment to Project'].forEach(s=>crumb.appendChild(el('strong','',s)));
    root.appendChild(crumb);
    const source=el('article','finance-register');
    source.innerHTML='<div class="finance-register-top"><div><p class="eyebrow">ROHINI · SOURCE GOOGLE SHEET · TEMPLATE v1.1</p>'+
      '<h3>Krishna Kumar Gupta — Payment to Project</h3>'+
      '<p>The payment source belongs to the Rohini project register. Its vendor/date/time details are maintained in the editable Google Sheet; the approved summary is presented below.</p>'+
      '</div><span class="badge ready">GOOGLE SHEETS SOURCE</span></div>';
    const button=el('a','finance-source-link','Open editable payment workbook ↗');
    button.href=sheetUrl;button.target='_blank';button.rel='noopener noreferrer';source.appendChild(button);
    root.appendChild(source);
    const dash=el('section','finance-dashboard');dash.id='financeDashboard';
    dash.appendChild(el('p','','Loading verified payment summary snapshot…'));root.appendChild(dash);
    loadSummary().then(renderSummary).catch(err=>{
      if(!document.getElementById('financeDashboard'))return;
      dash.textContent='';
      dash.appendChild(el('p','finance-error','The public summary snapshot could not be verified: '+err.message+'. Open the source Google Sheet for the authoritative values.'));
    });
  }
  selectors.forEach(b=>b.addEventListener('click',()=>render(b.dataset.company)));
  render('rohini');
})();