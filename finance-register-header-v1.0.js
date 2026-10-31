/* FN-S01: native read-only display of approved workbook fields inside the Finance header.
   All payment facts come from the existing verified public snapshot, not from a live Sheet API. */
(() => {
  'use strict';
  const SOURCE_ID = '1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE';
  const SOURCE_URL = 'https://docs.google.com/spreadsheets/d/' + SOURCE_ID + '/edit';
  const fmt = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtCount = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  const money = value => value === null || value === undefined ? '—' : fmt.format(value);
  const views = [
    { id: 'payments', title: '14_bishal_paija', sheetId: 594059714, note: 'All approved payment entries, in their original vendor-section order. The row number is a display index, not an internal entry ID.' },
    { id: 'vendors', title: 'KKG_VENDOR_SUMMARY_AUTO', sheetId: 770000027, note: 'The same 27 vendor totals linked to the register. This is a derived view, not another set of payments.' },
    { id: 'guide', title: '00_ENTRY_GUIDE', sheetId: 1487204034, note: 'Public-safe operating guidance selected from the source guide. Internal setup links and restricted instructions are not published.' },
    { id: 'context', title: '00_SITE_CONTEXT', sheetId: 1785179762, note: 'Approved source identity, refresh status and public display rules. Internal system settings are omitted.' },
    { id: 'enum', title: '_SYSTEM_ENUM', sheetId: 1064748325, note: 'Public date and amount definitions only. Historical artifact identifiers and internal system references are omitted.' }
  ];
  const guide = [
    ['Live register', '14_bishal_paija is the editable payment register. This website is a read-only display.'],
    ['Existing vendor payment', 'In the original Google Sheet, insert a new payment row above that vendor section’s Total row. Do not overwrite Total.'],
    ['New vendor', 'A new vendor section needs its own verified source table and linked totals. Do not copy colored cells and assume the structure was copied.'],
    ['Date and paid time', 'Keep the source date exactly as entered, including its AD or BS calendar. Paid Time is the recorded payment time, not the edit time.'],
    ['QR and discount', 'QR charges and discounts are independent fields. A blank field means not recorded, not zero.'],
    ['Summary totals', 'The vendor summary derives from the same original payment rows. Do not add summary totals to payment totals.'],
    ['Source preservation', 'The original workbook and its historical source evidence must not be overwritten by this website.'],
    ['Current website mode', 'Website refreshes happen only after an authorized source read and reconciliation. The website does not write to Google Sheets.'],
    ['Worker and company boundaries', 'Worker workbooks and Fishtail spending records are independent of this Rohini payment register.']
  ];
  const definitions = [
    ['Gregorian (AD)', 'Source dates labeled AD', 'Preserve the Gregorian date; do not combine with BS dates without verified conversion.'],
    ['Nepali (BS)', 'Source dates labeled BS', 'Preserve the literal Nepali date; never silently treat it as Gregorian.'],
    ['Paid time', 'Time recorded for a payment', 'Show the payment time as entered, not a worksheet modification time.'],
    ['Amount', 'Recorded payment amount in NPR', 'Keep the recorded amount unchanged; do not automatically deduct QR or discount.'],
    ['QR', 'Separate recorded QR amount', 'An empty source cell is shown as a dash; it does not claim a zero charge.'],
    ['Discount', 'Separate recorded discount amount', 'An empty source cell is shown as a dash; do not invent a discount.'],
    ['Vendor summary', 'Derived totals by vendor or purpose', 'Read the source register once; the linked summary is not a second transaction source.']
  ];
  const $ = id => document.getElementById(id);
  function node(tag, className, value) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (value !== undefined) n.textContent = String(value);
    return n;
  }
  function sum(items, key) {
    return items.reduce((total, row) => total + (row[key] ?? 0), 0);
  }
  function verified(data) {
    if (!data || data.schema !== 'jp.finance.public.v1' || !Array.isArray(data.vendors) ||
        !Array.isArray(data.payments) || !data.totals || !data.checks ||
        data.source?.workbook_url !== SOURCE_URL) throw new Error('Unrecognized source snapshot');
    const v = data.vendors, p = data.payments, t = data.totals;
    if (v.length !== t.vendor_count || p.length !== t.payment_count ||
        !data.checks.all_payment_ids_unique || !data.checks.all_vendor_totals_match ||
        !data.checks.source_grand_totals_match || !data.checks.internal_ids_excluded_from_public_data ||
        sum(v, 'amount_npr') !== t.amount_npr || sum(p, 'amount_npr') !== t.amount_npr ||
        sum(v, 'qr_npr') !== t.qr_npr || sum(p, 'qr_npr') !== t.qr_npr ||
        sum(v, 'discount_npr') !== t.discount_npr || sum(p, 'discount_npr') !== t.discount_npr) {
      throw new Error('Payment figures do not reconcile');
    }
    if (p.some(row => !v[row.vendor_id - 1] || row.vendor !== v[row.vendor_id - 1].name ||
        !['AD', 'BS'].includes(row.date_system) || !row.source_date ||
        Object.hasOwn(row, 'entry_id') || Object.hasOwn(row, 'created_at') ||
        Object.hasOwn(row, 'updated_at'))) throw new Error('Payment source contains an excluded field');
    for (const vendor of v) {
      const entries = p.filter(row => row.vendor_id === vendor.id);
      if (entries.length !== vendor.payment_count ||
          sum(entries, 'amount_npr') !== vendor.amount_npr ||
          sum(entries, 'qr_npr') !== (vendor.qr_npr ?? 0) ||
          sum(entries, 'discount_npr') !== (vendor.discount_npr ?? 0)) {
        throw new Error('Vendor payment totals do not match');
      }
    }
    return data;
  }
  function viewRows(tab, data) {
    const t = data.totals;
    switch (tab) {
      case 'payments':
        return {
          headers: ['#', 'Vendor / Purpose', 'Source date', 'Calendar', 'Paid time', 'Amount (NPR)', 'QR (NPR)', 'Discount (NPR)'],
          numeric: [0, 5, 6, 7],
          rows: data.payments.map((p, index) => ({
            cells: [String(index + 1), p.vendor, p.source_date, p.date_system, p.paid_time || '—', money(p.amount_npr), money(p.qr_npr), money(p.discount_npr)],
            vendor: p.vendor_id, calendar: p.date_system
          })),
          footer: ['Whole register', '', '', '', fmtCount.format(t.payment_count) + ' payments', money(t.amount_npr), money(t.qr_npr), money(t.discount_npr)]
        };
      case 'vendors':
        return {
          headers: ['ID', 'Vendor / Purpose', 'Payments', 'Amount (NPR)', 'QR (NPR)', 'Discount (NPR)', 'Share'],
          numeric: [0, 2, 3, 4, 5, 6],
          rows: data.vendors.map(v => ({
            cells: [String(v.id), v.name, String(v.payment_count), money(v.amount_npr), money(v.qr_npr), money(v.discount_npr), (100 * v.amount_npr / t.amount_npr).toFixed(1) + '%'],
            vendor: v.id
          })),
          footer: ['TOTAL', 'All registered vendors', String(t.payment_count), money(t.amount_npr), money(t.qr_npr), money(t.discount_npr), '100%']
        };
      case 'guide':
        return { headers: ['Topic', 'Public guidance'], numeric: [], rows: guide.map(cells => ({ cells })) };
      case 'context':
        return {
          headers: ['Group', 'Field', 'Verified public value'], numeric: [],
          rows: [
            ['Identity', 'Company', data.company],
            ['Identity', 'Project', data.project],
            ['Identity', 'Register', data.register],
            ['Identity', 'Google Sheet ID', SOURCE_ID],
            ['Source', 'Payment tab', data.source.register_tab],
            ['Source', 'Vendor summary tab', 'KKG_VENDOR_SUMMARY_AUTO'],
            ['Publication', 'Website display', (data.publication_mode === 'github_actions_google_sheets' ? 'Read-only, GitHub Actions Sheets refresh verified' : data.publication_mode === 'connected_google_sheet_verified_20261031' ? 'Read-only, source Sheet verified 2026-10-31' : 'Read-only, historical snapshot')],
            ['Publication', 'Last verified', data.verified_on],
            ['Publication', 'Approved fields', 'Company, project, vendor, source date, paid time, amount, QR and discount'],
            ['Publication', 'Not displayed', 'Hidden system tabs, internal entry IDs, edit timestamps, private account details and test entries'],
            ['Source totals', 'Vendors', String(t.vendor_count)],
            ['Source totals', 'Payments', String(t.payment_count)],
            ['Source totals', 'Amount (NPR)', money(t.amount_npr)],
            ['Source totals', 'QR (NPR)', money(t.qr_npr)],
            ['Source totals', 'Discount (NPR)', money(t.discount_npr)],
            ['Calendar', 'AD and BS', 'Keep calendar systems distinct; no automatic date conversion'],
            ['Company scope', 'Rohini only', 'Fishtail and worker workbooks are separate source authorities']
          ].map(cells => ({ cells }))
        };
      case 'enum':
        return { headers: ['Concept', 'Interpretation', 'Display rule'], numeric: [], rows: definitions.map(cells => ({ cells })) };
      default: throw new Error('Unknown source tab');
    }
  }
  function init() {
    const root = $('fnS01Native');
    if (!root) return;
    const tableWrap = $('fnS01TableScroll'), panel = $('fnS01TablePanel');
    const search = $('fnS01Search'), vendor = $('fnS01Vendor'), calendar = $('fnS01Calendar');
    const limit = $('fnS01Limit'), vendorLabel = $('fnS01VendorLabel'), calendarLabel = $('fnS01CalendarLabel');
    const status = $('fnS01Status'), stats = $('fnS01Stats'), description = $('fnS01Description');
    const tabTitle = $('fnS01TabTitle'), tabId = $('fnS01ActiveSheetId');
    const previous = $('fnS01Previous'), next = $('fnS01Next'), pager = $('fnS01Pager');
    const buttons = Array.from(root.querySelectorAll('[data-fn-s01-tab]'));
    if (!tableWrap || !panel || !search || !vendor || !calendar || !limit || !status || !buttons.length) return;
    let data = null, active = 'payments', page = 0;
    function setStatus(message, error = false) {
      status.textContent = message;
      status.classList.toggle('jp-fn-s01-error', error);
    }
    function render() {
      if (!data) return;
      const view = views.find(item => item.id === active);
      const display = viewRows(active, data);
      const vendorFilter = vendor.value, calendarFilter = calendar.value;
      const query = search.value.trim().toLocaleLowerCase();
      const filtered = display.rows.filter(row => {
        if (vendorFilter && (active === 'payments' || active === 'vendors') && String(row.vendor) !== vendorFilter) return false;
        if (calendarFilter && active === 'payments' && row.calendar !== calendarFilter) return false;
        return !query || row.cells.some(value => String(value).toLocaleLowerCase().includes(query));
      });
      const size = limit.value === 'all' ? Math.max(filtered.length, 1) : Number(limit.value);
      const pages = Math.max(1, Math.ceil(filtered.length / size));
      page = Math.max(0, Math.min(page, pages - 1));
      const first = page * size;
      const visible = filtered.slice(first, first + size);
      description.textContent = view.note;
      if (tabTitle) tabTitle.textContent = view.title;
      if (tabId) tabId.textContent = String(view.sheetId);
      vendorLabel.hidden = !['payments', 'vendors'].includes(active);
      calendarLabel.hidden = active !== 'payments';
      for (const button of buttons) {
        const selected = button.dataset.fnS01Tab === active;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        if (selected) panel.setAttribute('aria-labelledby', button.id);
      }
      const table = node('table', 'jp-fn-s01-table' + (display.headers.length < 4 ? ' jp-fn-s01-text-table' : ''));
      const thead = node('thead'), tr = node('tr');
      for (const [index, label] of display.headers.entries()) {
        const th = node('th', display.numeric.includes(index) ? 'jp-fn-s01-numeric' : '', label);
        th.scope = 'col';
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      table.appendChild(thead);
      const tbody = node('tbody');
      for (const item of visible) {
        const row = node('tr');
        for (const [index, value] of item.cells.entries()) {
          const cell = node('td', display.numeric.includes(index) ? 'jp-fn-s01-numeric' : '', value);
          row.appendChild(cell);
        }
        tbody.appendChild(row);
      }
      if (!visible.length) {
        const row = node('tr'), cell = node('td', '', 'No rows match these filters.');
        cell.colSpan = display.headers.length;
        row.appendChild(cell);
        tbody.appendChild(row);
      }
      table.appendChild(tbody);
      if (display.footer) {
        const foot = node('tfoot'), row = node('tr');
        for (const [index, value] of display.footer.entries()) {
          const cell = node(index === 0 ? 'th' : 'td', display.numeric.includes(index) ? 'jp-fn-s01-numeric' : '', value);
          if (index === 0) cell.scope = 'row';
          row.appendChild(cell);
        }
        foot.appendChild(row);
        table.appendChild(foot);
      }
      panel.replaceChildren(table);
      const start = filtered.length ? first + 1 : 0;
      const end = Math.min(first + visible.length, filtered.length);
      pager.textContent = 'Showing ' + start + '–' + end + ' of ' + filtered.length + ' rows · ' + view.title;
      previous.disabled = page === 0;
      next.disabled = page >= pages - 1;
      setStatus(filtered.length + ' accessible rows in this view. Source snapshot verified ' + data.verified_on + '.');
    }
    function choose(id, focus = false) {
      if (!views.some(item => item.id === id)) return;
      active = id;
      page = 0;
      search.value = '';
      vendor.value = '';
      calendar.value = '';
      render();
      if (focus) buttons.find(button => button.dataset.fnS01Tab === id)?.focus();
    }
    for (const [index, button] of buttons.entries()) {
      button.addEventListener('click', () => choose(button.dataset.fnS01Tab));
      button.addEventListener('keydown', event => {
        const count = buttons.length;
        const nextIndex = event.key === 'ArrowRight' ? (index + 1) % count :
          event.key === 'ArrowLeft' ? (index + count - 1) % count :
          event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : -1;
        if (nextIndex < 0) return;
        event.preventDefault();
        choose(buttons[nextIndex].dataset.fnS01Tab, true);
      });
    }
    for (const control of [search, vendor, calendar, limit]) {
      control.addEventListener(control === search ? 'input' : 'change', () => { page = 0; render(); });
    }
    previous.addEventListener('click', () => { page--; render(); tableWrap.focus(); });
    next.addEventListener('click', () => { page++; render(); tableWrap.focus(); });
    $('fnS01CopyTabId')?.addEventListener('click', async () => {
      const view = views.find(item => item.id === active);
      if (!view) return;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(String(view.sheetId));
        setStatus('Worksheet ID copied: ' + view.title + '.');
      } catch {
        setStatus('Select the worksheet ID shown above to copy it.');
      }
    });
    $('fnS01CopyId')?.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(SOURCE_ID);
        setStatus('Google Sheet ID copied.');
      } catch {
        setStatus('Select the Sheet ID shown above to copy it.');
      }
    });
    fetch('finance-public-snapshot.json', { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Snapshot could not be loaded');
        return response.json();
      })
      .then(snapshot => {
        data = verified(snapshot);
        $('fnS01Verified').textContent = data.verified_on;
        const labels = [
          ['Vendors', fmtCount.format(data.totals.vendor_count)],
          ['Payments', fmtCount.format(data.totals.payment_count)],
          ['Recorded amount', 'NPR ' + fmtCount.format(data.totals.amount_npr)],
          ['QR / Discount', 'NPR ' + fmtCount.format(data.totals.qr_npr) + ' / ' + fmtCount.format(data.totals.discount_npr)]
        ];
        stats.replaceChildren();
        for (const [label, value] of labels) {
          const card = node('div', 'jp-fn-s01-stat');
          card.append(node('span', '', label), node('strong', '', value));
          stats.appendChild(card);
        }
        for (const item of data.vendors) {
          const option = node('option', '', item.id + ' · ' + item.name);
          option.value = String(item.id);
          vendor.appendChild(option);
        }
        render();
      })
      .catch(error => {
        panel.textContent = 'The verified register view is unavailable. The source Sheet and the separate Payment Dashboard remain available.';
        setStatus(error.message || 'Unable to load the source snapshot.', true);
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
