// ---------------------------------------------------------------------------
// /api/state  — mémoire PARTAGÉE (posts générés/édités, note du jour, historique
// des accroches). Protégé par la session.
//
// GET  /api/state?space=<id>  → { ok, posts:{commercial:content}, dailyNote, history:[{author,hook}] }
// POST /api/state  body { op, space, commercial?, content?, author?, hook? }
//   op = savePost | deletePost | saveDaily | appendHook
//
// Visibilité des contenus générés :
//   - un ADMIN voit TOUS les posts générés (comportement inchangé) ;
//   - un utilisateur NON admin ne voit que les posts qu'il a lui-même générés
//     (chaque post mémorise son auteur dans le champ `by`).
// ---------------------------------------------------------------------------

import { requireAuth } from '../lib/auth.js';
import { kvGet, kvList, kvSet, kvDel, isConfigured } from '../lib/store.js';

const HISTORY_KEY = 'history';
const HISTORY_MAX = 60;

export default async function handler(req, res) {
  const session = requireAuth(req, res);
  if (!session) return;

  if (!isConfigured()) {
    return res.status(500).json({
      ok: false,
      error: 'Stockage partagé non configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).',
      code: 'NO_STORE',
    });
  }

  try {
    if (req.method === 'GET') {
      const space = String((req.query && req.query.space) || '').trim();
      const out = { ok: true, posts: {}, dailyNote: '', history: [] };

      const hist = await kvGet(HISTORY_KEY);
      out.history = hist && Array.isArray(hist.items) ? hist.items : [];

      if (space) {
        const rows = await kvList(`post:${space}:`);
        for (const r of rows) {
          const commercial = String(r.key).split(':').slice(2).join(':');
          if (!commercial || !r.value || typeof r.value.content !== 'string') continue;
          // Non-admin : ne voir que ses propres contenus. Les posts sans auteur
          // (générés avant cette fonctionnalité) restent réservés aux admins.
          if (!session.admin && r.value.by !== session.user) continue;
          out.posts[commercial] = r.value.content;
        }
        const daily = await kvGet(`daily:${space}`);
        out.dailyNote = daily && typeof daily.text === 'string' ? daily.text : '';
      }
      return res.status(200).json(out);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
      const { op, space, commercial, content, author, hook } = body || {};

      if (op === 'savePost') {
        if (!space || !commercial) return res.status(400).json({ ok: false, error: 'space + commercial requis' });
        // Mémorise l'auteur : un non-admin ne verra ensuite que ses propres posts.
        await kvSet(`post:${space}:${commercial}`, { content: String(content == null ? '' : content), by: session.user });
      } else if (op === 'deletePost') {
        if (!space || !commercial) return res.status(400).json({ ok: false, error: 'space + commercial requis' });
        // Un non-admin ne peut supprimer que ses propres contenus.
        if (!session.admin) {
          const existing = await kvGet(`post:${space}:${commercial}`);
          if (existing && existing.by !== session.user) {
            return res.status(403).json({ ok: false, error: 'Vous ne pouvez supprimer que vos propres contenus.' });
          }
        }
        await kvDel(`post:${space}:${commercial}`);
      } else if (op === 'saveDaily') {
        if (!space) return res.status(400).json({ ok: false, error: 'space requis' });
        await kvSet(`daily:${space}`, { text: String(content == null ? '' : content) });
      } else if (op === 'appendHook') {
        const cur = await kvGet(HISTORY_KEY);
        let items = cur && Array.isArray(cur.items) ? cur.items : [];
        items.push({ author: String(author || ''), hook: String(hook || '') });
        // dédoublonne (author|hook) en gardant les plus récents, puis plafonne.
        const seen = new Set();
        const dedup = [];
        for (let i = items.length - 1; i >= 0; i--) {
          const kk = items[i].author + '|' + items[i].hook;
          if (seen.has(kk)) continue;
          seen.add(kk);
          dedup.unshift(items[i]);
        }
        await kvSet(HISTORY_KEY, { items: dedup.slice(-HISTORY_MAX) });
      } else {
        return res.status(400).json({ ok: false, error: 'op inconnue' });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
