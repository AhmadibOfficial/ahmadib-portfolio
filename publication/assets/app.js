(() => {
  'use strict';
  const search = document.querySelector('[data-article-search]');
  const cards = Array.from(document.querySelectorAll('[data-article-card]'));
  const filterButtons = Array.from(document.querySelectorAll('[data-category-filter]'));
  const count = document.getElementById('article-count');
  const empty = document.getElementById('empty-state');
  let activeCategory = 'all';
  function update() {
    if (!cards.length) return;
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const haystack = (card.dataset.search || card.textContent).toLocaleLowerCase();
      const visible = (activeCategory === 'all' || category === activeCategory) && haystack.includes(query);
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (count) count.textContent = `${shown} ${shown === 1 ? 'article' : 'articles'} available`;
    if (empty) empty.setAttribute('aria-hidden', String(shown !== 0));
  }
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    activeCategory = btn.dataset.categoryFilter;
    filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    update();
  }));
  search?.addEventListener('input', update);
  document.addEventListener('keydown', ev => {
    if (ev.key === '/' && search && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName) && !ev.metaKey && !ev.ctrlKey) {
      ev.preventDefault(); search.focus();
    }
  });
  update();
})();
