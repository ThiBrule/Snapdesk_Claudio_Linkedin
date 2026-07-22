// ---------------------------------------------------------------------------
// /api/persona  — voir / éditer le persona (voix) d'un bloc.
//
// Accès : un ADMIN peut éditer n'importe quel bloc ; un non-admin ne peut éditer
// QUE son propre bloc (session.commercial).
//
// GET  /api/persona?key=<bloc>  → { ok, persona }
// POST /api/persona  { key, name?, role?, temperature?, toneOfVoice?, template?,
//                      extraInstructions?, guidance?, addPosts?, clearExamples? }
//   - addPosts (texte, posts séparés par une ligne vide) : AJOUT ILLIMITÉ, mais
//     seuls les N plus récents sont conservés (fenêtre glissante → poids borné).
// ---------------------------------------------------------------------------

import { requireActiveUser } from '../lib/auth.js';
import { kvGet, kvSet, isConfigured } from '../lib/store.js';
import { getCommercial } from '../lib/commercials/index.js';
import { buildUserPersona, applyPersonaEdits } from '../lib/persona.js';

// Charge la base d'un persona : override enregistré, sinon persona statique (fichier),
// sinon construit depuis la fiche utilisateur.
async function loadBase(key) {
  const stored = await kvGet(`persona:${key}`);
  if (stored) return stored;
  const staticC = getCommercial(key);
  if (staticC) return { ...staticC };
  const rec = await kvGet(`user:${key}`);
  if (rec) return buildUserPersona({ key, name: rec.name, role: rec.role, bio: rec.bio });
  return null;
}

export default async function handler(req, res) {
  const session = await requireActiveUser(req, res);
  if (!session) return;
  if (!isConfigured()) {
    return res.status(500).json({ ok: false, error: 'Stockage partagé (Supabase) non configuré.', code: 'NO_STORE' });
  }

  const keyFrom = (v) => String(v || '').trim().toLowerCase();
  const canEdit = (key) => session.admin || (key && key === keyFrom(session.commercial));

  try {
    if (req.method === 'GET') {
      const key = keyFrom(req.query && req.query.key);
      if (!key) return res.status(400).json({ ok: false, error: 'key requis' });
      if (!canEdit(key)) return res.status(403).json({ ok: false, error: 'Accès réservé à ton propre persona.' });
      const persona = await loadBase(key);
      if (!persona) return res.status(404).json({ ok: false, error: 'Persona introuvable' });
      return res.status(200).json({ ok: true, persona });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
      const key = keyFrom(body && body.key);
      if (!key) return res.status(400).json({ ok: false, error: 'key requis' });
      if (!canEdit(key)) return res.status(403).json({ ok: false, error: 'Tu ne peux modifier que ton propre persona.' });

      const base = (await loadBase(key)) || buildUserPersona({ key, name: key, role: '', bio: '' });
      const updated = applyPersonaEdits(base, body);
      updated.key = key;
      await kvSet(`persona:${key}`, updated);
      return res.status(200).json({ ok: true, persona: updated });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
