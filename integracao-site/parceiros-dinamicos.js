const PARTNERS_API_URL = 'https://script.google.com/macros/s/AKfycbw40vJyZUFkFyTYtFaqizp5mRuaN3C2RAKbQPNhE68q8zLZDinaK6BBy0VKj4Uozh6Ncw/exec';

async function carregarParceiros() {
  const grid = document.querySelector('#partners-grid');
  if (!grid) return;
  try {
    const response = await fetch(PARTNERS_API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('Falha ao consultar parceiros');
    const { parceiros } = await response.json();
    grid.innerHTML = parceiros.map(p => `
      <article class="partner-card">
        ${p.logo ? `<img src="${safeUrl(p.logo)}" alt="Logo ${escapeHtml(p.nome)}" loading="lazy">` : ''}
        <div class="partner-category">${escapeHtml(p.categoria || '')}</div>
        <h3>${escapeHtml(p.nome)}</h3>
        <strong>${escapeHtml(p.beneficio || '')}</strong>
        ${p.descricao ? `<p>${escapeHtml(p.descricao)}</p>` : ''}
        ${p.instagram ? `<a href="${safeUrl(p.instagram)}" target="_blank" rel="noopener">Ver Instagram</a>` : ''}
      </article>`).join('');
  } catch (error) {
    console.error(error);
  }
}
function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function safeUrl(v){try{const u=new URL(v,location.origin);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}}
document.addEventListener('DOMContentLoaded', carregarParceiros);
