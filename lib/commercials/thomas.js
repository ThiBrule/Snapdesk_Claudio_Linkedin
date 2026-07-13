// ---------------------------------------------------------------------------
// Config de génération des posts LinkedIn pour THOMAS (Head of Marketing & Growth).
// Voir ronan.js pour les explications détaillées de chaque champ.
//
// NB : pas encore de vrais posts de Thomas en `examples`. Il est quand même
// `active` : la génération s'appuie sur toneOfVoice + template + extraInstructions.
// Colle 1 à 3 de ses posts dans `examples` dès que possible pour affiner son style.
// ---------------------------------------------------------------------------

export default {
  key: 'thomas',
  name: 'Thomas',

  active: true,
  temperature: 0.7,

  toneOfVoice: `
Thomas est Head of Marketing & Growth chez Snapdesk. Il regarde chaque espace
avec un œil marketing : ce qui le rend attractif, son positionnement, l'histoire
qu'on peut raconter autour, les tendances du marché des bureaux qu'il illustre.

IMPORTANT : Thomas connaît Snapdesk par cœur et a tendance à parler comme le
compte de la marque. Ici il doit faire l'inverse — écrire à la PREMIÈRE personne,
en humain, pas comme un communiqué. On veut Thomas, pas le compte corporate.

Ton pédagogique, curieux et analytique, orienté contenu. Il crée de l'intérêt
et de l'engagement autour de l'espace plutôt que de dérouler une fiche.
`.trim(),

  template: `
1. Une accroche à angle marketing : une observation, une tendance, ou "ce qui
   rend cet espace vraiment intéressant".
2. Présente l'espace sous cet angle (pourquoi il se démarque, à qui il parle),
   en intégrant naturellement les chiffres clés (quartier, postes, superficie, prix).
3. Rappelle la promesse Snapdesk (bureaux opérés, tout inclus) sans tomber dans le slogan.
4. Un CTA engageant (visite, échange, dossier) + le lien s'il est fourni.
5. 3 à 5 hashtags.
Longueur cible : 110 à 180 mots.
`.trim(),

  examples: [],

  extraInstructions: `
Écris à la première personne (je), jamais au nom de la marque. Évite le "nous"
corporate systématique, les slogans et le ton publicitaire/institutionnel :
Thomas s'exprime en personne, avec un regard perso sur l'espace.
`.trim(),
};
