(() => {
  const D = window.JP_KNOWN_RATES_DATA;
  const $ = id => document.getElementById(id);
  const money = n => "NPR " + new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(Number(n||0));
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const join = a => (a && a.length ? a.join(", ") : "—");

  function haystack(r){
    return [
      r.known_rate_id,r.work_name,r.category,r.unit,r.rate_basis,r.location,r.effective_date,
      r.source_type,r.source_label,r.status,r.confidence,r.notes,
      ...(r.aliases||[]),...(r.included||[]),...(r.excluded||[]),...(r.unspecified||[])
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function metric(k,v,s){
    return '<div class="metric"><div class="k">'+esc(k)+'</div><div class="v">'+esc(v)+'</div><div class="s">'+esc(s)+'</div></div>';
  }

  function card(r){
    return '<article class="known-rate-card">'+
      '<div class="known-rate-head"><div><div class="known-rate-id">'+esc(r.known_rate_id)+'</div><h3>'+esc(r.work_name)+'</h3><p>'+esc(r.category)+'</p></div>'+
      '<div class="known-rate-price"><strong>'+esc(money(r.rate_npr))+'</strong><span>/ '+esc(r.unit)+'</span></div></div>'+
      '<div class="known-rate-meta">'+
        '<span class="badge ready">'+esc(r.rate_basis)+'</span>'+
        '<span class="badge demo">'+esc(r.source_type)+'</span>'+
        '<span class="badge pending">effective date '+esc(r.effective_date || "unspecified")+'</span>'+
      '</div>'+
      '<div class="known-scope-grid">'+
        '<div><b>Included</b><p>'+esc(join(r.included))+'</p></div>'+
        '<div><b>Excluded</b><p>'+esc(join(r.excluded))+'</p></div>'+
        '<div><b>Unspecified</b><p>'+esc(join(r.unspecified))+'</p></div>'+
        '<div><b>Location</b><p>'+esc(r.location || "Unspecified")+'</p></div>'+
      '</div>'+
      '<div class="known-aliases"><b>Search aliases:</b> '+esc(join(r.aliases))+'</div>'+
      '<p class="known-note">'+esc(r.notes || "")+'</p>'+
    '</article>';
  }

  function render(){
    const q = $("knownRateSearch").value.trim().toLowerCase();
    const rows = D.entries.filter(r => !q || haystack(r).includes(q));

    $("knownMetrics").innerHTML =
      metric("Known rates", D.entries.length, "manual reference records") +
      metric("Matches", rows.length, q ? 'for "'+q+'"' : "showing all") +
      metric("Official records", "0", "kept in governed Rate Library") +
      metric("Latest update", D.updated_at, "dataset recorded date");

    $("knownRateResults").innerHTML = rows.length
      ? rows.map(card).join("")
      : '<div class="empty">No known rate matched <b>'+esc(q)+'</b>. Try another term or send the missing rate for addition.</div>';

    $("knownRateTable").innerHTML = rows.map(r =>
      '<tr><td class="code">'+esc(r.known_rate_id)+'</td><td><b>'+esc(r.work_name)+'</b></td><td class="num">'+esc(money(r.rate_npr))+'</td><td>'+esc(r.unit)+'</td><td>'+esc(join(r.included))+'</td><td>'+esc(join(r.excluded))+'</td><td>'+esc(r.location||"Unspecified")+'</td><td>'+esc(r.effective_date||"Unspecified")+'</td></tr>'
    ).join("");
  }

  const params = new URLSearchParams(location.search);
  $("knownRateSearch").value = params.get("q") || "";
  $("knownRateSearch").addEventListener("input", render);
  $("clearKnownSearch").addEventListener("click", () => {
    $("knownRateSearch").value = "";
    history.replaceState(null,"",location.pathname);
    render();
    $("knownRateSearch").focus();
  });

  $("exportKnownRates").addEventListener("click", () => {
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify(D,null,2)],{type:"application/json"}));
    a.download="jp_known_rates_reference.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  render();
})();
