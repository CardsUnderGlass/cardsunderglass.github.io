(() => {
  const input = document.querySelector('.search input');
  if (input) {
    const cards = [...document.querySelectorAll('.catalogue-card')], count = document.querySelector('.result-count'), empty = document.querySelector('.no-results');
    const normalizeDigits = value => value.replace(/\D/g, '').replace(/^0+/, '') || '0';
    const update = () => {
      const query = input.value.trim().toLowerCase(), digitsOnly = /^\d+$/.test(query), queryDigits = digitsOnly ? normalizeDigits(query) : '';
      const ranked = cards.map((card, order) => {
        const serial = card.dataset.serial, searchable = card.dataset.search;
        let score = query ? (searchable.includes(query) ? 20 : -1) : 0;
        if (digitsOnly && normalizeDigits(serial) === queryDigits) score = 100;
        else if (query && serial.includes(query)) score = Math.max(score, 60);
        card.hidden = score < 0;
        return { card, score, order };
      }).sort((a, b) => b.score - a.score || a.order - b.order);
      const list = document.querySelector('#report-list'); ranked.forEach(item => list.append(item.card));
      const visible = ranked.filter(item => item.score >= 0).length;
      count.textContent = visible + (visible === 1 ? ' report' : ' reports'); empty.hidden = visible !== 0;
    };
    input.addEventListener('input', update);
  }
  const dialog = document.querySelector('.lightbox');
  if (dialog) {
    const image = dialog.querySelector('img'), label = dialog.querySelector('.lightbox-head strong');
    document.querySelectorAll('[data-lightbox-src]').forEach(button => button.addEventListener('click', () => {
      image.src = button.dataset.lightboxSrc; image.alt = button.dataset.lightboxLabel; label.textContent = button.dataset.lightboxLabel; dialog.showModal();
    }));
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  }
  const markers = [...document.querySelectorAll('[data-defect]')];
  const selectDefect = number => {
    markers.forEach(marker => { const active = marker.dataset.defect === number; marker.classList.toggle('active', active); marker.setAttribute('aria-pressed', String(active)); });
    document.querySelectorAll('[data-defect-detail]').forEach(detail => detail.classList.toggle('active', detail.dataset.defectDetail === number));
  };
  markers.forEach(marker => marker.addEventListener('click', () => selectDefect(marker.dataset.defect)));
  if (markers.length) selectDefect(markers[0].dataset.defect);
})();
