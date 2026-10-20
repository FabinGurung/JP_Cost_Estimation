(() => {
  'use strict';
  const board = document.getElementById('poster-board');
  const filters = document.getElementById('poster-filters');
  const search = document.getElementById('poster-search');
  const count = document.getElementById('poster-count');
  if (!board || !filters || !search || !count) return;
  let all = [];
  let selected = 'All';
  const make = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  };
  const allowedTones = new Set(['mint','sky','peach','cream']);
  const safePage = value => typeof value === 'string' && /^[a-z0-9-]+\.html$/.test(value);
  function draw() {
    const q = search.value.trim().toLocaleLowerCase();
    const visible = all.filter(p => (selected === 'All' || p.category === selected) &&
      [p.category,p.title,p.takeaway,p.detail].join(' ').toLocaleLowerCase().includes(q));
    board.replaceChildren();
    for (const p of visible) {
      const card = make('article','poster-card');
      card.dataset.tone = allowedTones.has(p.tone) ? p.tone : 'cream';
      const meta = make('div','poster-meta');
      meta.append(make('span','',p.category),make('span','poster-priority',p.priority));
      card.append(meta,make('h3','',p.title),make('p','poster-takeaway',p.takeaway),make('p','poster-detail',p.detail));
      if (safePage(p.href)) {
        const link = make('a','poster-open',(p.label || 'Open reference') + ' →');
        link.href = p.href;
        card.append(link);
      }
      board.append(card);
    }
    if (!visible.length) board.append(make('p','poster-empty','No matching posters. Try a different word or category.'));
    count.textContent = visible.length + ' of ' + all.length + ' posters';
  }
  function categories() {
    const options = ['All',...new Set(all.map(p => p.category))];
    filters.replaceChildren();
    for (const option of options) {
      const button = make('button','',option);
      button.type = 'button';
      button.setAttribute('aria-pressed',String(option === selected));
      button.addEventListener('click',() => {
        selected = option;
        for (const child of filters.children) child.setAttribute('aria-pressed',String(child.textContent === selected));
        draw();
      });
      filters.append(button);
    }
  }
  search.addEventListener('input',draw);
  fetch('memory-posters.json',{cache:'no-store'}).then(response => {
    if (!response.ok) throw new Error('Poster file unavailable');
    return response.json();
  }).then(data => {
    if (!data || !Array.isArray(data.posters)) throw new Error('Poster format unavailable');
    all = data.posters.filter(p => p && typeof p.title === 'string' && typeof p.category === 'string');
    categories();
    draw();
  }).catch(() => {
    count.textContent = 'Reference board unavailable';
    board.replaceChildren(make('p','poster-empty','The posters could not be loaded. Please try again later.'));
  });
})();
