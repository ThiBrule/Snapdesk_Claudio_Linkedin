// ---------------------------------------------------------------------------
// Config de génération des posts LinkedIn pour FLORIAN (Business Developer).
// Voir ronan.js pour les explications détaillées de chaque champ.
// ---------------------------------------------------------------------------

export default {
  key: 'florian',
  name: 'Florian',

  active: true,
  temperature: 0.75,

  toneOfVoice: `
Florian est Business Developer chez Snapdesk, même métier que Mélanie mais ton
plus direct, pragmatique et énergique. Orienté terrain : il va droit au but,
crée une urgence saine ("pépite à ne pas louper") et parle concret.

Il met l'espace en avant à travers des situations réelles rencontrées avec ses
clients et ce qui fait la différence en visite. Emojis marqués mais maîtrisés
(🔥 🤩 🌿). Il vouvoie le lecteur, phrases courtes et punchy.
`.trim(),

  template: `
1. Accroche forte, punchy (un mot en capitales est permis pour marquer le coup :
   "PÉPITE À NE PAS LOUPER", "ESPACE INDÉPENDANT").
2. Annonce directe : quartier, superficie, nombre de postes, disponibilité.
3. Le détail structuré : si le lieu est grand, découpe par étage / zone ; sinon
   des puces courtes (postes, salles de réunion, espaces de vie, services).
4. Rappel "tout inclus" Snapdesk en une ligne.
5. CTA cash : "Partant pour une visite ?" + le lien s'il est fourni.
6. 3 à 5 hashtags.
Longueur cible : 100 à 180 mots. Rythme rapide, aéré.
`.trim(),

  examples: [
`🔥 PÉPITE À NE PAS LOUPER 🔥

🌿 Espace indépendant — Marais / Bastille — 2000 m²

Vos futurs bureaux sont chez Snapdesk 🤩

Au sein d'un bâtiment historique, un magnifique espace indépendant de 2000 m² réparti sur 3 étages et divisibles !

RDC et double mezzanine :
▫️ 114 postes + 6 salles de réunion
▫️ Un grand espace de vie et une énorme cuisine
▫️ 3 salles de phoning, un auditorium, des douches

R+1 :
▫️ 106 postes + 5 salles de réunion, un bel espace détente

R+2 :
▫️ 78 postes + 2 salles de réunion

Le petit plus : un boulodrome au sous-sol pour les amateurs de pétanque 🎱

L'espace sera livré entièrement aménagé, tous services inclus (mobilier, ménage, café, impressions, internet…).

Partant pour une visite ? 👉 [lien]

#Snapdesk #BureauOpéré #Paris #flexoffice`,
  ],

  extraInstructions: ``,
};
