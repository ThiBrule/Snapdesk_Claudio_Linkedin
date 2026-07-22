// ---------------------------------------------------------------------------
// Blocs PERSONNELS : chaque utilisateur a son propre persona (sa carte, sa voix),
// écrit à la première personne. Le STYLE dérive de son rôle ; la VOIX est affinée
// par sa bio / les posts qu'il a fournis à l'inscription.
//
// La clé d'un bloc personnel = l'e-mail (pseudo) de l'utilisateur. Les 7 personas
// "officiels" (ronan, cyril, … snapdesk) restent des blocs statiques réutilisables.
// ---------------------------------------------------------------------------

import { COMMERCIAL_KEYS } from './commercials/index.js';

// Style d'écriture par rôle (archétype). Personnalisé ensuite avec le nom + la bio.
const ROLE_TONE = {
  'Sales': "Commercial(e) terrain : direct, concret, orienté bénéfices clients et passage à l'action (visite, échange). Énergique et chaleureux, phrases courtes.",
  'Marketing': "Marketing & growth : accrocheur, storytelling, angles tendance, met en valeur la marque et les usages. Dynamique et créatif.",
  'Product Manager': "Vision produit & marché : réflexion de fond, prises de position, tendances du flex office et du futur du travail. Posé et inspirant.",
  'Facility Manager': "Opérations & expérience : met en avant le concret du quotidien (services, confort, tout-inclus, zéro contrainte). Fiable et rassurant.",
  'Architecte': "Design & aménagement : parle volumes, lumière, agencement, mise en scène des espaces. Esthétique et précis.",
  'Sourcing': "Acquisition & marché : parle opportunités, emplacements, immobilier, flair du bon spot. Assuré et stratégique.",
};

const BASE_TEMPLATE = `
1. Accroche personnelle qui capte l'attention.
2. Le cœur du message : ce que tu partages (un espace, une actu, un conseil, une prise de position) — reste concret et ancré sur les infos fournies.
3. Structure aérée (puces / emojis avec parcimonie si ça sert le propos).
4. Une conclusion ou une invitation à l'échange / à la visite.
5. 2 à 5 hashtags pertinents.
Longueur cible : 100 à 200 mots. Écris à la PREMIÈRE PERSONNE du singulier ("je"), naturellement, comme toi.
`.trim();

/** Le bloc est-il l'un des 7 personas statiques (ronan, cyril, …) ? */
export function isStaticBlock(key) {
  return COMMERCIAL_KEYS.includes(String(key || '').toLowerCase());
}

/** Construit un persona à partir de la fiche utilisateur (nom, rôle, bio). */
export function buildUserPersona({ key, name, role, bio }) {
  const who = (name && name.trim()) || 'Membre Snapdesk';
  const tone = ROLE_TONE[role] || "Professionnel(le) Snapdesk : authentique, clair, orienté valeur.";
  const toneOfVoice =
    `${who}${role ? `, ${role}` : ''} chez Snapdesk.\n${tone}\n` +
    `Écrit à la première personne du singulier ("je"), de façon authentique et personnelle — ` +
    `c'est ${who} qui parle, pas la marque ni un autre membre.`;

  let extraInstructions =
    "Reste fidèle aux vraies infos de l'espace (fiche Hubspot / données fournies). " +
    "Ne mens jamais, ne mentionne pas de prix, valorise au maximum les atouts.";
  if (bio && bio.trim()) {
    extraInstructions +=
      `\n\nÉléments fournis par ${who} sur son métier, son style et/ou des posts qu'il/elle a déjà écrits ` +
      `— IMITE fortement ce ton, ce vocabulaire et cette structure :\n"""\n${bio.trim()}\n"""`;
  }

  return {
    key: String(key).toLowerCase(),
    name: who,
    role: role || '',
    active: true,
    temperature: 0.8,
    toneOfVoice,
    template: BASE_TEMPLATE,
    examples: [],
    extraInstructions,
    isUser: true,
  };
}

// Nombre max de posts de référence gardés (fenêtre glissante) : on peut en
// AJOUTER à l'infini, mais on ne stocke que les N plus récents → poids borné.
export const EXAMPLES_CAP = 12;

// Découpe un bloc de texte en posts individuels (séparés par une ligne vide).
export function splitPosts(text) {
  return String(text || '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
}

// Applique les champs éditables sur un persona existant.
//   - champs texte : name, role, toneOfVoice, template, extraInstructions, guidance
//   - temperature : 0..1.5
//   - addPosts (string|array) : AJOUTE des posts de référence (fenêtre glissante, cap N)
//   - examples (array|string) : REMPLACE la liste (usage avancé/admin)
//   - clearExamples (true)    : vide la liste
export function applyPersonaEdits(base, edits) {
  const out = { ...base };
  for (const f of ['name', 'role', 'toneOfVoice', 'template', 'extraInstructions', 'guidance']) {
    if (typeof edits[f] === 'string') out[f] = edits[f];
  }
  if (edits.temperature != null && !Number.isNaN(Number(edits.temperature))) {
    out.temperature = Math.max(0, Math.min(1.5, Number(edits.temperature)));
  }

  let examples = Array.isArray(out.examples) ? out.examples.slice() : [];
  if (edits.clearExamples) examples = [];
  if (Array.isArray(edits.examples)) {
    examples = edits.examples.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof edits.examples === 'string') {
    examples = splitPosts(edits.examples);
  }
  if (edits.addPosts != null) {
    const added = Array.isArray(edits.addPosts) ? edits.addPosts.map((s) => String(s).trim()).filter(Boolean) : splitPosts(edits.addPosts);
    examples = examples.concat(added);
  }
  out.examples = examples.slice(-EXAMPLES_CAP); // ne garde que les plus récents
  out.postsLearned = (Number(base.postsLearned) || 0) + (edits.addPosts != null ? (Array.isArray(edits.addPosts) ? edits.addPosts.filter(Boolean).length : splitPosts(edits.addPosts).length) : 0);

  out.isUser = true;
  out.active = true;
  return out;
}
