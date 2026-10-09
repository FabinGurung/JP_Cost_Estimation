(() => {
  'use strict';
  const companies = {
    rohini: {
      heading: 'Rohini Engineering and Builders Pvt. Ltd.',
      description: 'Independent Rohini payment evidence. Project-scoped, not an all-company vendor bill or a canonical construction rate.',
      connected: true
    },
    fishtail: {
      heading: 'Fishtail Builders Pvt. Ltd.',
      description: 'Distinct company authority. No Fishtail finance register is attached to this public navigation.',
      connected: false
    },
    other: {
      heading: 'Other organizations',
      description: 'Add each organization through explicit governance and ownership approval. No existing finance sheet is inherited.',
      connected: false
    }
  };
  const content = document.getElementById('financeContent');
  const heading = document.getElementById('companyHeading');
  const subheading = document.getElementById('companySubheading');
  const buttons = Array.from(document.querySelectorAll('[data-company]'));

  const rohiniHtml = `
    <div class="finance-breadcrumb"><strong>Rohini</strong><span aria-hidden="true">›</span>
      <strong>14_Bishal_Paija</strong><span aria-hidden="true">›</span>
      <strong>Payment to Project</strong></div>
    <article class="finance-register">
      <div class="finance-register-top"><div>
        <p class="eyebrow">PRIVATE GOOGLE SHEETS • HUMAN WORKING REGISTER</p>
        <h3>Payment to Project — KKG register</h3>
        <p>This is a project-payment evidence link for the Rohini workstream. It is not a company-wide payment ledger, and the original paid dates/times remain in Google Sheets.</p>
      </div><span class="badge ready">TEMPLATE v1.1</span></div>
      <div class="finance-meta">
        <div><small>Organization</small><strong>Rohini Engineering and Builders</strong></div>
        <div><small>Project</small><strong>14_Bishal_Paija</strong></div>
        <div><small>Record type</small><strong>Payment to Project</strong></div>
        <div><small>Ownership</small><strong>Private Drive / Rohini</strong></div>
      </div>
      <div class="finance-access">
        <label for="privateSheetUrl">Authorized users: paste your private Google Sheets URL</label>
        <div class="finance-access-row">
          <input type="url" id="privateSheetUrl" inputmode="url" autocomplete="off"
            placeholder="https://docs.google.com/spreadsheets/d/.../edit"
            aria-describedby="financeAccessHelp">
          <button id="openPrivateSheet" type="button" class="btn primary" disabled>Open private workbook ↗</button>
        </div>
        <p id="financeAccessHelp" class="finance-help">This public page does not store or transmit your link. Drive sharing permissions still apply. Obtain the link from your private A9 workspace.</p>
        <p id="financeAccessError" class="finance-error" role="status" aria-live="polite"></p>
      </div>
    </article>
    <div class="finance-info-note">
      <strong>No amounts are exposed here.</strong> The payment register's edit timestamps, vendor details and financial values remain in the private Google Sheet. Do not confuse this evidence with government `RO-*` unit rates or with the demo BOQ totals.
    </div>`;
  const disconnectedHtml = `
    <div class="finance-empty">
      <h3>No register connected in this navigation</h3>
      <p>The original company/project records remain wherever their owning Drive controls place them. New links require verified ownership and an explicit private-access design, not a copy of Rohini's payment register.</p>
      <a href="index.html" class="btn">Return to estimator</a>
    </div>`;

  function render(companyKey) {
    const data = companies[companyKey] || companies.rohini;
    heading.textContent = data.heading;
    subheading.textContent = data.description;
    content.innerHTML = data.connected ? rohiniHtml : disconnectedHtml;
    buttons.forEach(btn => {
      const selected = btn.dataset.company === companyKey;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    const input = document.getElementById('privateSheetUrl');
    const open = document.getElementById('openPrivateSheet');
    if (!input || !open) return;
    const error = document.getElementById('financeAccessError');
    let validated = null;
    input.addEventListener('input', () => {
      validated = null;
      try {
        const url = new URL(input.value.trim());
        const ok = url.protocol === 'https:' &&
          url.hostname === 'docs.google.com' &&
          /^\/spreadsheets\/d\/[A-Za-z0-9_-]+(?:\/|$)/.test(url.pathname);
        if (ok) validated = url.href;
      } catch (_) {}
      open.disabled = !validated;
      error.textContent = input.value.trim() && !validated ? 'Enter a full Google Sheets document URL.' : '';
    });
    open.addEventListener('click', () => {
      if (!validated) return;
      const newTab = window.open(validated, '_blank', 'noopener,noreferrer');
      if (!newTab) error.textContent = 'Your browser blocked the new tab. Allow pop-ups for this action, or open the private URL directly.';
    });
  }
  buttons.forEach(btn => btn.addEventListener('click', () => render(btn.dataset.company)));
  render('rohini');
})();