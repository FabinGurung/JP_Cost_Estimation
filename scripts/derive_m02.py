"""Derive separate public presentation files from the frozen private JSONL.
Usage: python scripts/derive_m02.py /path/to/recovered /path/to/review_resume
No original Drive identities, finance, customer fields or private quote prices.
"""
import json,sys,re,hashlib,gzip
from pathlib import Path
root=Path(__file__).resolve().parents[1]
raw=Path(sys.argv[1]); review=Path(sys.argv[2])
out=root/'data'/'source-derived-v0.5.15';out.mkdir(exist_ok=True)
def rows(p):return [json.loads(l) for l in p.read_text().splitlines() if l.strip()] if p.exists() else []
def save(name,data):
 p=out/(name+'.gz');p.write_bytes(gzip.compress((json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n').encode(),compresslevel=9,mtime=0));return str(p.relative_to(root))
def chunk(alias,kind,items,size):
 return [save(alias.lower()+'-'+kind+'-'+str(i//size+1)+'.json',items[i:i+size]) for i in range(0,len(items),size)]
catalog=json.loads((root/'data/rate-source-public-skeleton.v0.5.14.json').read_text())
catalog.update(schema='jp-cres.source_derivations.v0.5.15',revision='v0.5.15',scope='source_separated_derived_views',extraction_complete=True,semantic_verification_complete=False,baseline='M02 / m02-raw-v1',baseline_commit='80a3650e8de3be1488b742f79246620543d2cffc')
for p in raw.iterdir():
 s=rows(p/'sources.jsonl')[0];alias=s['projection_alias'];item=next(x for x in catalog['sources'] if x['id']==alias)
 item.update(page_count=s['page_count'],source_sha256=s['source_sha256'],parse_status='RAW_EXTRACTED_CONTENT_REVIEW_PENDING',verified_observations=None,verified_pages=None)
 entries=[];candidates=[];pages=[]
 if alias=='SRC-VEN-002':
  for r in rows(p/'prior_normalized_records.jsonl'):
   entries.append(dict(id='typed-'+str(r['source_line_no']),description=r['source_wording'],unit=r['source_uom'],value=None,raw_value=None,page=1,basis='Typed quotation · price private',status='REDACTED_PRIVATE_QUOTATION',part='Typed quotation',row=r['source_line_no']))
  for r in rows(review/'handwritten_line_groups.jsonl'):
   entries.append(dict(id=r['record_id'],description=r['description_raw'],unit=r['unit_raw'],value=None,raw_value=None,page=r['page_no'],basis='Handwritten estimate · price private',status='VISUAL_TRANSCRIPTION_UNVERIFIED',part='Handwritten estimate',row=r['line_no']))
  item['notes']='Two distinct document parts: a typed quotation and a handwritten estimate. Product descriptions only are shown; prices, quantities, totals, customer fields and page transcripts stay private.'
  item['private_fields_withheld']=True
 elif alias=='SRC-VEN-001':
  for r in rows(p/'prior_normalized_records.jsonl'):
   entries.append(dict(id=r['rate_observation_id'],description=r['source_product_name']+' — '+str(r.get('source_size_or_variant') or ''),unit=r.get('default_unit'),value=r.get('rate_npr'),raw_value=str(r.get('rate_npr')),page=r['source_page'],basis=r.get('rate_basis'),status='EXISTING_SOURCE_EXTRACTION',part=r.get('source_section'),row=None,tax=r.get('tax_included'),transport=r.get('transport_included')))
  item['notes']='Published catalogue observations, kept separate from quotations and district prices. Dates and validity remain source-specific; no current-price guarantee.'
 elif alias=='SRC-GOV-001':
  for r in rows(p/'reuses.jsonl'):
   v=r['original_master_row'];note=v.get('Notes') or '';description=re.split(r'source wording:',note,flags=re.I)[-1].strip() if re.search(r'source wording:',note,re.I) else str(v.get('Variant_Spec') or v.get('Subject_ID') or 'Source item')
   num=v.get('Rate_NPR'); val=float(str(num).replace(',','')) if num not in [None,''] else None
   entries.append(dict(id=r['canonical_rate_observation_id'],description=description,unit=v.get('Unit'),value=val,raw_value=num,page=r['source_page_no'],basis=v.get('Rate_Basis'),status='EXISTING_SOURCE_EXTRACTION',part=v.get('Subject_Type'),row=None,tax=v.get('Tax_Included'),transport=v.get('Transport_Included')))
  item['notes']='Existing district observations plus a separate machine-candidate view of the full PDF. Reused rows are not new master insertions. OCR text is preserved as extracted.'
 else:
  item['notes']='Complete page coverage with machine-derived numeric cells. Numbers may be coefficients, rates, quantities, totals or serial numbers; roles and units are unresolved. This evidence book does not calculate a unit rate.'
 if alias!='SRC-VEN-002':
  for r in rows(p/'observations.jsonl'):
   candidates.append(dict(id=r['record_id'],description=r.get('raw_description') or 'Description not recovered',unit=r.get('raw_unit'),value=r.get('numeric_value'),raw_value=r.get('raw_numeric_text'),page=r['page_no'],row=r.get('row_index'),basis='Numeric cell · role unverified',status=r.get('numeric_interpretation_status'),part='Machine candidates',bbox=r.get('bbox_pt'),confidence=r.get('confidence'),role='Unresolved numeric cell',method=r.get('extraction_method')))
 if alias not in ['SRC-VEN-001','SRC-VEN-002']:
  for r in rows(p/'pages.jsonl'):
   pages.append(dict(page=r['page_no'],text=r.get('raw_text') or '',method=r.get('method'),rotation=r.get('rotation_clockwise_deg'),status='MACHINE_TRANSCRIPT_UNVERIFIED'))
 item.update(entry_count=len(entries),candidate_count=len(candidates),transcript_count=len(pages),entries=chunk(alias,'entries',entries,1000),candidates=chunk(alias,'candidates',candidates,1000),pages=chunk(alias,'pages',pages,25))
catalog['rate_observation_count']=sum(s['entry_count'] for s in catalog['sources'])
catalog['privacy']='Original Drive IDs, customer/party information and private quotation prices are excluded. Analysis transcripts are source-book evidence, not approved pricing.'
catalog['notice']='M02 frozen raw extraction → source-specific derived views. Machine readings may be wrong; your visual feedback will drive new extraction and website versions.'
for g in catalog['groups']:
 if g['id']!='personal':g['status']='DERIVED_SOURCE_VIEW';g['count']=sum(s['entry_count']+s['candidate_count'] for s in catalog['sources'] if s['group']==g['id'])
(root/'data/rate-source-derived.v0.5.15.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
for filename in ['rate-sources.html','government-rates.html','vendor-price-lists.html','rate-analysis-references.html','kaski-district-rates.html','pipes-price-list.html','electrical-wire-quotation.html','contractor-rate-analysis.html','users-rate-analysis.html','dudbc-rate-analysis.html']:
 f=root/filename;t=f.read_text();t=t.replace('V0.5.14','V0.5.15')
 t=t.replace('Sunlit green-valley source libraries, independently versioned. No unverified PDF price is published as an approved work rate.','Explore each source independently. Derived readings retain their source page and extraction status.')
 t=t.replace('Source files stay in authenticated Drive. This public skeleton contains only source-safe metadata and no PDF rates.','M02 frozen source baseline · v0.5.15 derived views. Sources remain separate; private quotation fields are withheld.')
 t=t.replace('Extraction workspace','Extracted source explorer').replace('Review-ready extracted rate table','Extracted source entries').replace('Preview skeleton','M02 · iteration 001')
 t=t.replace('Verified observations','Extracted entries').replace('No verified rows published. Extraction and source QA pending.','Loading this source’s extracted entries…')
 t=t.replace('Rate / coefficient','Extracted value / basis')
 t=t.replace('There are no example or made-up prices in this table. Rows will appear only after original PDF extraction, unit checking and source-specific approval.','Readings are source-derived references. Unresolved fields remain blank; machine candidates are not approved rates.')
 t=t.replace('Source identity and inclusion details are still being verified.','Loading source notes…')
 t=t.replace('Skeleton','Source view')
 t=t.replace('Only the JP personal workbook collection is currently populated; the government, vendor, and rate-analysis document pages are skeletons awaiting page-verified extraction.','The JP personal collection and six extracted document views remain independent. Browse source observations, machine numeric candidates and page transcripts.')
 t=t.replace('Verified source identity required before prices appear here','District observations and extracted PDF evidence')
 t=t.replace('1 PDF currently inventoried · full document extraction and observation QA are pending.','1 PDF · 80 pages extracted, with 973 existing district observations and a separate machine-candidate view.')
 t=t.replace('2 PDFs currently inventoried · full document extraction and observation QA are pending.','2 PDFs extracted. Published pipe-catalogue prices and redacted electrical product descriptions appear on their own pages.')
 t=t.replace('3 PDFs inventoried, including separately located DUDBC file · full document extraction and observation QA are pending.','3 independent books · 596 pages extracted. Browse numeric candidates and page transcripts; OCR wording and number roles remain provisional.')
 f.write_text(t)
print(json.dumps({'source_count':6,'pages':sum(s['page_count'] for s in catalog['sources']),'entries':catalog['rate_observation_count'],'candidates':sum(s['candidate_count'] for s in catalog['sources']),'files':len(list(out.glob('*.json.gz'))),'bytes':sum(f.stat().st_size for f in out.glob('*.json.gz'))}))
