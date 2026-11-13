(() => {
  'use strict';

  const root = document.getElementById('vendor-bills-status');
  if (!root) return;

  const status = root.querySelector('[data-vendor-status]');
  const counts = {
    sourceTabs: 'Source tabs',
    sourceRows: 'Indexed rows',
    billRows: 'Bill records',
    detailRows: 'Detail rows',
    comparisonRows: 'Summary comparisons',
    reviewFlags: 'Review flags'
  };

  async function display() {
    const response = await fetch('data/vendor-bills-status.v1.json');
    if (!response.ok) throw new Error('Vendor Bills status unavailable');
    const data = await response.json();
    const validRevision = /^V[0-9]{6}$/.test(data.revision);
    const validCounts = Object.keys(counts).every(key => Number.isSafeInteger(data[key]) && data[key] >= 0);
    if (data.schema !== 'jp.vendor-bills-status.v1' || !validRevision || !validCounts) {
      throw new Error('Vendor Bills status invalid');
    }
    const list = root.querySelector('dl');
    const numbers = new Intl.NumberFormat('en-IN');
    for (const [key, label] of Object.entries(counts)) {
      const group = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = numbers.format(data[key]);
      group.append(term, description);
      list.append(group);
    }
    const mode = data.sourceMode === 'MANUAL_AUTHENTICATED_READ' ? 'Manual source read' : 'Verified snapshot';
    status.textContent = `${mode} · ${data.revision}`;
  }

  display().catch(() => {
    status.textContent = 'Vendor Bills counts are temporarily unavailable.';
  });
})();
