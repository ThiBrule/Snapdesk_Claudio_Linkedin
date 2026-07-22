// ---------------------------------------------------------------------------
// Éditeur de persona partagé (modale). Utilisé par users.html (admin, tous les
// blocs) et space.html (chaque utilisateur, son propre bloc).
//   PersonaEditor.open(key, { title?, toast?, onSaved? })
//
// « Ajouter des posts LinkedIn » = ajout ILLIMITÉ, mais on ne stocke/affiche
// jamais la liste complète : seuls les plus récents sont gardés côté serveur.
// ---------------------------------------------------------------------------
(function () {
  const H = `
  <div id="pe-modal" class="modal-overlay" aria-hidden="true">
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="pe-title" style="max-width:660px;">
      <div class="modal-head"><h3 id="pe-title">Persona</h3><button class="modal-close" id="pe-close" type="button" aria-label="Fermer">✕</button></div>
      <div id="pe-err" class="error-box" style="display:none; margin-bottom:12px;"></div>
      <div style="display:grid; gap:12px; overflow:auto; padding-right:2px;">
        <input type="hidden" id="pe-key">
        <div style="display:grid; grid-template-columns:1fr 1fr .7fr; gap:10px;">
          <label class="pe-f">Nom<input id="pe-name"></label>
          <label class="pe-f">Rôle<input id="pe-role"></label>
          <label class="pe-f">Température<input id="pe-temp" type="number" step="0.05" min="0" max="1.5"></label>
        </div>
        <label class="pe-f">Ton de voix<textarea id="pe-tone" rows="4"></textarea></label>
        <label class="pe-f">Structure du post (template)<textarea id="pe-template" rows="4"></textarea></label>
        <label class="pe-f">🎯 Ajustements pour les futurs posts<textarea id="pe-guidance" rows="3" placeholder="Ex. : toujours finir par une question · éviter les emojis · insister sur la flexibilité…"></textarea></label>
        <label class="pe-f">Instructions complémentaires<textarea id="pe-extra" rows="2"></textarea></label>
        <div style="border-top:1px dashed var(--line); padding-top:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:4px;">
            <span style="font-weight:600; font-size:13px;">➕ Ajouter des posts LinkedIn</span>
            <span id="pe-count" style="font-size:12px; color:var(--taupe);"></span>
          </div>
          <p style="font-size:12px; color:var(--taupe); margin:0 0 6px;">Colle un ou plusieurs posts (séparés par une ligne vide). Ils affinent les prochaines générations. Ajout illimité — seuls les plus récents sont gardés, rien n'est stocké visuellement.</p>
          <textarea id="pe-addposts" rows="5" placeholder="Colle ici des posts que tu as déjà écrits…"></textarea>
          <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; margin-top:8px; cursor:pointer; color:var(--red);"><input type="checkbox" id="pe-clear" style="width:15px;height:15px;"> Repartir de zéro (oublier les posts de référence actuels)</label>
        </div>
      </div>
      <div class="modal-foot"><button class="btn" id="pe-cancel" type="button">Annuler</button><button class="btn validate" id="pe-save" type="button">✓ Enregistrer</button></div>
    </div>
  </div>
  <style>
    .pe-f{display:flex;flex-direction:column;gap:5px;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--taupe);font-weight:600;}
    #pe-modal input,#pe-modal textarea{font-family:var(--sans);font-size:14px;text-transform:none;letter-spacing:normal;font-weight:400;color:var(--ink);background:var(--paper-2);border:1px solid var(--line);border-radius:9px;padding:9px 11px;width:100%;resize:vertical;box-sizing:border-box;}
    #pe-modal input:focus,#pe-modal textarea:focus{outline:2px solid var(--brass-ink);outline-offset:1px;border-color:transparent;}
  </style>`;

  let mounted = false, toastFn = null, onSaved = null;
  const $ = (id) => document.getElementById(id);

  function mount() {
    if (mounted) return;
    const d = document.createElement('div'); d.innerHTML = H; document.body.appendChild(d); mounted = true;
    $('pe-close').addEventListener('click', close);
    $('pe-cancel').addEventListener('click', close);
    $('pe-save').addEventListener('click', save);
    $('pe-modal').addEventListener('click', (e) => { if (e.target.id === 'pe-modal') close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('pe-modal').classList.contains('show')) close(); });
  }
  function openModal() { const el = $('pe-modal'); el.style.display = 'flex'; void el.offsetWidth; el.classList.add('show'); el.setAttribute('aria-hidden', 'false'); }
  function close() { const el = $('pe-modal'); el.classList.remove('show'); el.setAttribute('aria-hidden', 'true'); setTimeout(() => { if (!el.classList.contains('show')) el.style.display = 'none'; }, 220); }
  function err(t) { const e = $('pe-err'); e.textContent = t || ''; e.style.display = t ? 'block' : 'none'; }

  async function open(key, opts) {
    mount(); opts = opts || {}; toastFn = opts.toast || null; onSaved = opts.onSaved || null; err('');
    $('pe-title').textContent = 'Persona — ' + (opts.title || key);
    try {
      const res = await Auth.fetch('/api/persona?key=' + encodeURIComponent(key), { cache: 'no-store' });
      const data = await res.json();
      if (!data.ok) { err(data.error || 'Erreur'); openModal(); return; }
      const p = data.persona || {};
      $('pe-key').value = key;
      $('pe-name').value = p.name || '';
      $('pe-role').value = p.role || '';
      $('pe-temp').value = (p.temperature != null ? p.temperature : 0.8);
      $('pe-tone').value = p.toneOfVoice || '';
      $('pe-template').value = p.template || '';
      $('pe-guidance').value = p.guidance || '';
      $('pe-extra').value = p.extraInstructions || '';
      $('pe-addposts').value = '';
      $('pe-clear').checked = false;
      const n = Array.isArray(p.examples) ? p.examples.length : 0;
      const learned = Number(p.postsLearned) || 0;
      $('pe-count').textContent = `🧠 ${n} post${n > 1 ? 's' : ''} de référence en mémoire${learned ? ` · ${learned} ajoutés au total` : ''}`;
      openModal();
    } catch { err('Erreur réseau'); openModal(); }
  }

  async function save() {
    const btn = $('pe-save'); btn.disabled = true; err('');
    const payload = {
      key: $('pe-key').value,
      name: $('pe-name').value,
      role: $('pe-role').value,
      temperature: $('pe-temp').value,
      toneOfVoice: $('pe-tone').value,
      template: $('pe-template').value,
      guidance: $('pe-guidance').value,
      extraInstructions: $('pe-extra').value,
    };
    const add = $('pe-addposts').value.trim();
    if (add) payload.addPosts = add;
    if ($('pe-clear').checked) payload.clearExamples = true;
    try {
      const res = await Auth.fetch('/api/persona', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.ok) { err(data.error || 'Erreur'); btn.disabled = false; return; }
      if (toastFn) toastFn('Persona enregistré ✅');
      close();
      if (onSaved) onSaved(data.persona);
    } catch { err('Erreur réseau'); }
    btn.disabled = false;
  }

  window.PersonaEditor = { open };
})();
