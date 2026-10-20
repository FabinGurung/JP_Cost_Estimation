/* Shared navigation; page-specific controls and data stay untouched. */
(() => {
  'use strict';
  const sections = [
    ['overview','Overview','index.html'],
    ['rates','Rates','rate-sources.html'],
    ['finance','Finance','finance.html'],
    ['payments','Payment Dashboard','finance-dashboard.html'],
    ['posters','Memory Posters','memory-posters.html'],
    ['system','System Map','system-map.html']
  ];
  function currentSection(file) {
    if (file === 'memory-posters.html') return 'posters';
    if (file === 'finance-dashboard.html') return 'payments';
    if (file === 'finance.html' || file === 'field-expense-guide.html') return 'finance';
    if (file === 'system-map.html') return 'system';
    if (!file || file === 'index.html') return 'overview';
    return 'rates';
  }
  function install() {
    if (!document.body || document.getElementById('jp-site-masthead')) return;
    const file = location.pathname.split('/').pop() || 'index.html';
    const current = currentSection(file);
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'jp-main-content';
    const header = document.createElement('header');
    header.id = 'jp-site-masthead';
    const identity = document.createElement('a');
    identity.href = 'index.html';
    identity.className = 'jp-identity';
    identity.setAttribute('aria-label','JP Cost Estimation home');
    const seal = document.createElement('span');
    seal.className = 'jp-seal';
    seal.textContent = 'JP';
    const words = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = 'JP COST ESTIMATION';
    const subtitle = document.createElement('small');
    subtitle.textContent = 'Rates · Projects · Payments';
    words.append(name,subtitle);
    identity.append(seal,words);
    const links = document.createElement('nav');
    links.className = 'jp-global-nav';
    links.setAttribute('aria-label','JP site sections');
    for (const [id,label,href] of sections) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      if (id === current) a.setAttribute('aria-current',file === href ? 'page' : 'location');
      links.appendChild(a);
    }
    header.append(identity,links);
    const skip = document.createElement('a');
    skip.className = 'jp-skip';
    skip.href = '#' + (main ? main.id : 'jp-site-footer');
    skip.textContent = 'Skip to content';
    document.body.insertBefore(header,document.body.firstChild);
    document.body.insertBefore(skip,header);
    const footer = document.createElement('footer');
    footer.id = 'jp-site-footer';
    const left = document.createElement('strong');
    left.textContent = 'JP COST ESTIMATION';
    const right = document.createElement('span');
    right.textContent = 'Rates and project payments are separate source collections · ';
    const link = document.createElement('a');
    link.href = 'memory-posters.html';
    link.textContent = 'Reference wall';
    right.appendChild(link);
    footer.append(left,right);
    document.body.appendChild(footer);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
