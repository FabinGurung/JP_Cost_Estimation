/* Shared navigation. Three L1 departments; supporting pages stay available in More. */
(() => {
  'use strict';
  const primarySections = [
    ['rates','Rates','rate-sources.html'],
    ['finance','Finance','finance.html'],
    ['posters','Memory Posters','memory-posters.html']
  ];
  const moreSections = [
    ['home','Home','index.html'],
    ['payments','Payment Dashboard','finance-dashboard.html'],
    ['field','Field Expense Guide','field-expense-guide.html'],
    ['system','System Map','system-map.html']
  ];
  function currentDepartment(file) {
    if (file === 'memory-posters.html') return 'posters';
    if (file === 'finance.html' || file === 'finance-dashboard.html' || file === 'field-expense-guide.html') return 'finance';
    if (!file || file === 'index.html' || file === 'system-map.html') return null;
    return 'rates';
  }
  function makeLink(id,label,href,file,department) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (file === href) link.setAttribute('aria-current','page');
    else if (id === department) link.setAttribute('aria-current','location');
    return link;
  }
  function install() {
    if (!document.body || document.getElementById('jp-site-masthead')) return;
    const file = location.pathname.split('/').pop() || 'index.html';
    const department = currentDepartment(file);
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
    links.setAttribute('aria-label','JP site departments and more');
    for (const [id,label,href] of primarySections) {
      links.appendChild(makeLink(id,label,href,file,department));
    }
    const more = document.createElement('details');
    more.className = 'jp-more';
    const toggle = document.createElement('summary');
    toggle.className = 'jp-more-toggle';
    toggle.textContent = 'More';
    toggle.setAttribute('aria-label','More site pages');
    if (file === 'index.html' || file === 'system-map.html') toggle.setAttribute('aria-current','location');
    const panel = document.createElement('div');
    panel.className = 'jp-more-panel';
    panel.setAttribute('role','group');
    panel.setAttribute('aria-label','Additional site pages');
    for (const [id,label,href] of moreSections) {
      panel.appendChild(makeLink(id,label,href,file,null));
    }
    more.append(toggle,panel);
    links.appendChild(more);
    document.addEventListener('click',event => {
      if (more.open && !more.contains(event.target)) more.open = false;
    });
    document.addEventListener('keydown',event => {
      if (event.key === 'Escape' && more.open) {
        more.open = false;
        toggle.focus();
      }
    });
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
