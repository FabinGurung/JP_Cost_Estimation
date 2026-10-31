(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const fmt = value => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
  const money = value => 'NPR ' + fmt(value);
  const cellAmount = value => value === null ? '—' : fmt(value);
  const total = (rows, key) => rows.reduce((sum, row) => sum + (row[key] ?? 0), 0);
  const colors = ['#2c855c', '#68b58b', '#d5a54c', '#7b9f7b', '#507a9b', '#a4bd8a', '#c7d8ca'];
  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = String(content);
    return node;
  }
  function validAmount(value) {
    return value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0);
  }
  function verify(data) {
    if (!data || data.schema !== 'jp.finance.public.v1' || !Array.isArray(data.vendors) ||
        !Array.isArray(data.payments) || !data.totals || !data.checks) {
      throw new Error('Unrecognized project data format');
    }
    const v = data.vendors, p = data.payments, t = data.totals;
    if (!v.length || !p.length || v.length !== t.vendor_count || p.length !== t.payment_count ||
        v.some((row, index) => row.id !== index + 1 || !row.name ||
          !validAmount(row.amount_npr) || !validAmount(row.qr_npr) || !validAmount(row.discount_npr)) ||
        p.some(row => !Number.isInteger(row.vendor_id) || !v[row.vendor_id - 1] ||
          row.vendor !== v[row.vendor_id - 1].name || !row.source_date ||
          !['AD', 'BS'].includes(row.date_system) || !validAmount(row.amount_npr) ||
          !validAmount(row.qr_npr) || !validAmount(row.discount_npr) ||
          Object.hasOwn(row, 'entry_id') || Object.hasOwn(row, 'created_at') ||
          Object.hasOwn(row, 'updated_at'))) {
      throw new Error('Invalid vendor or payment entries');
    }
    if (total(p, 'amount_npr') !== t.amount_npr || total(p, 'qr_npr') !== t.qr_npr ||
        total(p, 'discount_npr') !== t.discount_npr ||
        total(v, 'amount_npr') !== t.amount_npr || total(v, 'qr_npr') !== t.qr_npr ||
        total(v, 'discount_npr') !== t.discount_npr ||
        !data.checks.all_payment_ids_unique || !data.checks.all_vendor_totals_match ||
        !data.checks.source_grand_totals_match || !data.checks.internal_ids_excluded_from_public_data) {
      throw new Error('Published figures do not reconcile');
    }
    for (const vendor of v) {
      const entries = p.filter(row => row.vendor_id === vendor.id);
      if (entries.length !== vendor.payment_count ||
          total(entries, 'amount_npr') !== vendor.amount_npr ||
          total(entries, 'qr_npr') !== (vendor.qr_npr ?? 0) ||
          total(entries, 'discount_npr') !== (vendor.discount_npr ?? 0)) {
        throw new Error('A vendor total does not match its payment entries');
      }
    }
    if (!/^https:\/\/docs\.google\.com\/spreadsheets\/d\//.test(data.source?.workbook_url || '')) {
      throw new Error('Source workbook link is missing');
    }
    return data;
  }
  function addBarList(root, rows, getName, getValue, limit) {
    root.replaceChildren();
    const sorted = [...rows].sort((a, b) => getValue(b) - getValue(a));
    const selected = limit ? sorted.slice(0, limit) : sorted;
    if (!selected.length) { root.append(el('p', 'hint', 'No recorded values to display.')); return; }
    const maximum = Math.max(1, ...selected.map(getValue));
    for (const item of selected) {
      const row = el('div', 'bar-row');
      const label = el('span', 'bar-label', getName(item)); label.title = getName(item);
      const track = el('div', 'bar-track');
      const fill = el('div', 'bar-fill');
      fill.style.width = (100 * getValue(item) / maximum).toFixed(2) + '%';
      track.append(fill);
      const value = el('span', 'bar-value', fmt(getValue(item)));
      row.append(label, track, value); root.append(row);
    }
  }
  function drawShare(data) {
    const sorted = [...data.vendors].sort((a, b) => b.amount_npr - a.amount_npr);
    const top = sorted.slice(0, 5);
    const remainder = sorted.slice(5).reduce((s, row) => s + row.amount_npr, 0);
    const pieces = top.map(row => ({ name: row.name, amount: row.amount_npr }));
    if (remainder > 0) pieces.push({ name: 'Other vendors', amount: remainder });
    let start = 0;
    const segments = [];
    const legend = $('shareLegend'); legend.replaceChildren();
    for (let i = 0; i < pieces.length; i++) {
      const item = pieces[i], share = 100 * item.amount / data.totals.amount_npr;
      segments.push(colors[i] + ' ' + start.toFixed(4) + '% ' + (start + share).toFixed(4) + '%');
      start += share;
      const row = el('div', 'legend-row');
      const swatch = el('span', 'legend-color'); swatch.style.backgroundColor = colors[i];
      const name = el('span', 'legend-label', item.name); name.title = item.name;
      const value = el('span', 'legend-value', share.toFixed(1) + '%');
      row.append(swatch, name, value); legend.append(row);
    }
    $('shareDonut').style.background = 'conic-gradient(' + segments.join(',') + ')';
    $('shareDonut').setAttribute('aria-label', pieces.map(p => p.name + ': ' + money(p.amount)).join('; '));
    $('donutTotal').textContent = money(data.totals.amount_npr);
  }
  function drawDate(data, system) {
    const map = new Map();
    for (const payment of data.payments) {
      if (payment.date_system !== system) continue;
      const record = map.get(payment.source_date) || { date: payment.source_date, amount: 0, count: 0 };
      record.amount += payment.amount_npr; record.count++;
      map.set(payment.source_date, record);
    }
    const rows = [...map.values()].sort((a, b) =>
      a.date.replaceAll('_', '-').localeCompare(b.date.replaceAll('_', '-')));
    const maximum = Math.max(1, ...rows.map(row => row.amount));
    const chart = $('dateChart'); chart.replaceChildren();
    for (const item of rows) {
      const column = el('div', 'date-item');
      const amount = el('span', 'date-amount', fmt(item.amount));
      const track = el('div', 'date-track');
      const fill = el('div', 'date-fill');
      fill.style.height = (100 * item.amount / maximum).toFixed(2) + '%';
      track.append(fill);
      const date = el('span', 'date-label', item.date);
      const count = el('span', 'date-count', item.count + (item.count === 1 ? ' payment' : ' payments'));
      column.title = item.date + ': ' + money(item.amount) + ', ' + item.count + ' entries';
      column.append(amount, track, date, count); chart.append(column);
    }
    const entries = data.payments.filter(p => p.date_system === system);
    $('dateNote').textContent = rows.length + ' recorded dates · ' + entries.length + ' payments · ' +
      money(total(entries, 'amount_npr')) + '. ' +
      (system === 'BS' ? 'Original Nepali BS labels retained.' : 'Original Gregorian labels retained.') +
      ' Scroll horizontally to view all dates.';
  }
  function appendCell(row, value, numeric) {
    row.append(el('td', numeric ? 'num' : '', String(value)));
  }
  function drawVendors(data, search) {
    const filtered = [...data.vendors].filter(v =>
      (v.name + ' ' + v.id).toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.amount_npr - a.amount_npr);
    const tbody = $('vendorBody'); tbody.replaceChildren();
    for (const vendor of filtered) {
      const row = el('tr');
      appendCell(row, vendor.id);
      appendCell(row, vendor.name);
      appendCell(row, vendor.payment_count, true);
      appendCell(row, fmt(vendor.amount_npr), true);
      appendCell(row, (100 * vendor.amount_npr / data.totals.amount_npr).toFixed(1) + '%', true);
      appendCell(row, cellAmount(vendor.qr_npr), true);
      appendCell(row, cellAmount(vendor.discount_npr), true);
      tbody.append(row);
    }
    if (!filtered.length) {
      const row = el('tr'), cell = el('td', '', 'No matching vendors.'); cell.colSpan = 7; row.append(cell); tbody.append(row);
    }
    $('vendorCountNote').textContent = 'Showing ' + filtered.length + ' of ' + data.vendors.length +
      ' vendors. Search does not change the project totals above.';
  }
  function drawPayments(data) {
    const term = $('paymentSearch').value.trim().toLowerCase();
    const vendorId = $('vendorFilter').value;
    const system = $('paymentDateFilter').value;
    const filtered = data.payments.filter(p =>
      (!vendorId || String(p.vendor_id) === vendorId) &&
      (!system || p.date_system === system) &&
      (!term || (p.vendor + ' ' + p.source_date + ' ' + p.amount_npr + ' ' + (p.paid_time || '')).toLowerCase().includes(term)));
    const tbody = $('paymentBody'); tbody.replaceChildren();
    for (const p of filtered) {
      const row = el('tr');
      appendCell(row, p.vendor);
      appendCell(row, p.source_date + ' (' + p.date_system + ')');
      appendCell(row, p.paid_time ?? '—');
      appendCell(row, fmt(p.amount_npr), true);
      appendCell(row, cellAmount(p.qr_npr), true);
      appendCell(row, cellAmount(p.discount_npr), true);
      tbody.append(row);
    }
    if (!filtered.length) {
      const row = el('tr'), cell = el('td', '', 'No matching payment entries.'); cell.colSpan = 6; row.append(cell); tbody.append(row);
    }
    $('paymentCountNote').textContent = 'Showing ' + filtered.length + ' of ' + data.payments.length +
      ' payment entries · Displayed amount: ' + money(total(filtered, 'amount_npr')) +
      ' · Project totals above always show the full register.';
  }
  function render(data) {
    $('amountTotal').textContent = money(data.totals.amount_npr);
    $('paymentCount').textContent = fmt(data.totals.payment_count);
    $('vendorCount').textContent = fmt(data.totals.vendor_count);
    $('qrTotal').textContent = money(data.totals.qr_npr);
    $('discountTotal').textContent = money(data.totals.discount_npr);
    $('asOf').textContent = 'Verified ' + data.verified_on + (data.publication_mode === 'github_actions_google_sheets' ? ' · Google Sheets via GitHub Actions' : data.publication_mode === 'connected_google_sheet_verified_20261031' ? ' · LIVE Sheet independently verified 31 Oct' : ' · Historical snapshot');
    $('sourceLink').href = data.source.workbook_url;
    $('sourceButton').href = data.source.workbook_url;
    $('sourceDescription').textContent = data.register + ' · ' + data.project +
      ' · ' + data.source.register_tab + '!A7:E34 and A35:H190 · ' +
      data.totals.vendor_count + ' vendor sections and ' + data.totals.payment_count +
      ' payments reconcile to ' + money(data.totals.amount_npr) + '.';
    let expanded = false;
    const drawRank = () => addBarList($('rankChart'), data.vendors, v => v.name, v => v.amount_npr, expanded ? null : 10);
    drawRank();
    $('rankToggle').addEventListener('click', () => {
      expanded = !expanded; $('rankToggle').textContent = expanded ? 'Show top 10' : 'Show all'; drawRank();
    });
    drawShare(data);
    drawDate(data, $('dateSystem').value);
    $('dateSystem').addEventListener('change', () => drawDate(data, $('dateSystem').value));
    addBarList($('qrChart'), data.vendors.filter(v => (v.qr_npr ?? 0) > 0),
      v => v.name, v => v.qr_npr);
    addBarList($('discountChart'), data.vendors.filter(v => (v.discount_npr ?? 0) > 0),
      v => v.name, v => v.discount_npr);
    drawVendors(data, '');
    $('vendorSearch').addEventListener('input', () => drawVendors(data, $('vendorSearch').value.trim()));
    for (const vendor of data.vendors) {
      const option = el('option', '', vendor.name); option.value = String(vendor.id);
      $('vendorFilter').append(option);
    }
    ['paymentSearch', 'vendorFilter', 'paymentDateFilter'].forEach(id =>
      $(id).addEventListener(id === 'paymentSearch' ? 'input' : 'change', () => drawPayments(data)));
    drawPayments(data);
    $('dashboard').hidden = false;
    $('status').hidden = true;
  }
  fetch('finance-public-snapshot.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error('Project snapshot unavailable'); return response.json(); })
    .then(verify).then(render)
    .catch(error => {
      $('status').className = 'error';
      $('status').textContent = 'The project figures could not be verified: ' + error.message +
        '. Please use the original Google Sheet for current figures.';
    });
})();
