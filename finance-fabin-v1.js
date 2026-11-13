(() => {
  'use strict';
  const surface=document.getElementById('fabinPublicDashboard');
  if(!surface) return;
  const status=document.getElementById('fabinReadStatus');
  const content=document.getElementById('fabinLiveContent');
  const metrics=document.getElementById('fabinMetrics');
  const rows=document.getElementById('fabinProjectRows');
  const note=document.getElementById('fabinSourceNote');
  const num=new Intl.NumberFormat('en-IN',{minimumFractionDigits:0,maximumFractionDigits:3});
  const currency=n=>'NPR '+num.format(n);
  const el=(tag,name,value)=>{
    const node=document.createElement(tag);
    if(name)node.className=name;
    if(value!==undefined)node.textContent=String(value);
    return node;
  };
  const finite=n=>typeof n==='number' && Number.isFinite(n);
  const valid=data=>{
    if(!data || data.schema!=='jp.fabin-payments.source-aggregate.v1' ||
      data.authenticatedSourceFetch!==true ||
      data.publicationStatus!=='SOURCE_REPORTED_NOT_VERIFIED' ||
      !Array.isArray(data.projects) || data.projects.length!==5 ||
      data.sourceProjectCount!==5 || !finite(data.sourceDeclaredGrandTotalNpr) ||
      !finite(data.normalizedEventsGrandTotalNpr) ||
      !finite(data.reconciliationDifferenceNpr) ||
      !data.privacy || data.privacy.publishedIndividualTransactions!==0 ||
      data.privacy.publishedPartyNames!==0 ||
      data.privacy.officialProjectIdentityVerified!==false) return false;
    const unique=new Set(data.projects.map(p=>p.sourceProject));
    if(unique.size!==5 ||
      data.projects.some(p=>!p.sourceProject || !finite(p.sourceAmountNpr) ||
          !finite(p.normalizedEntriesNpr) || !finite(p.differenceNpr) ||
          p.approval!=='NOT_VERIFIED' ||
          !['SOURCE_TOTAL_CONFLICT','ARITHMETIC_MATCH_ONLY'].includes(p.reconciliation)))return false;
    return Math.abs(data.projects.reduce((sum,p)=>sum+p.sourceAmountNpr,0) -
       data.sourceDeclaredGrandTotalNpr)<0.01;
  };
  async function initialize(){
    try{
      const response=await fetch('fabin-payments-public.json',{cache:'no-store'});
      if(!response.ok)throw new Error('No published source');
      const data=await response.json();
      if(!valid(data))throw new Error('Projection failed validation');
      status.textContent='Authenticated Google Sheets read · '+data.sourceVersion+
        ' · Source-reported only — NO payment certification';
      status.className='fabin-status-success';
      for(const [title,value,sub] of [
        ['Source workbook total',currency(data.sourceDeclaredGrandTotalNpr),'Five listed projects; excludes Basketball'],
        ['Normalized event sum',currency(data.normalizedEventsGrandTotalNpr),'Source entries, not approved payments'],
        ['Source arithmetic difference',currency(data.reconciliationDifferenceNpr),data.reconciliationDifferenceNpr===0?'Reconciled in summary; receipts remain unapproved':'Reconcile source discrepancies before approval'],
        ['Source rows',num.format(data.sourceEventCount),'No payee or personal transaction detail published']
      ]){
        const card=el('article','fabin-metric');
        card.append(el('span','fabin-metric-label',title),
          el('strong','fabin-metric-value',value),
          el('small','fabin-metric-description',sub));
        metrics.append(card);
      }
      for(const p of data.projects){
        const tr=document.createElement('tr');
        const fields=[p.sourceProject,p.companyAsRecorded,currency(p.sourceAmountNpr),
          currency(p.normalizedEntriesNpr),currency(p.differenceNpr),
          p.reconciliation==='ARITHMETIC_MATCH_ONLY'?'Arithmetic only · not approved':'Difference unresolved'];
        fields.forEach((value,i)=>{
          const td=el('td',i===0?'fabin-project':(i>=2&&i<=4?'fabin-number':''),
            value);
          if(i===4&&p.differenceNpr!==0)td.classList.add('fabin-alert');
          if(i===5&&p.reconciliation!=='ARITHMETIC_MATCH_ONLY')td.classList.add('fabin-alert');
          tr.append(td);
        });
        rows.append(tr);
      }
      const stamp=new Date(data.generatedAtUtc);
      note.textContent='Last authenticated source projection: '+
        (Number.isNaN(stamp.valueOf())?'date unavailable':stamp.toLocaleString('en-NP',{dateStyle:'medium',timeStyle:'short'}))+
        '. '+data.reviewQueueIssueCount+' historical/source review issues remain. Basketball is excluded due to overlap. Source totals are arithmetically '+(data.reconciliationDifferenceNpr===0?'aligned':'unresolved')+' but remain unverified; they are not certified expenditure, an approved BOQ, or proof of money paid.';
      content.hidden=false;
    }catch(_){
      status.className='fabin-status-pending';
      status.textContent='Authenticated Fabin source summary is unavailable or has not passed admission. No provisional financial figures are shown; the private Google Sheet remains the authority.';
    }
  }
  initialize();
})();
