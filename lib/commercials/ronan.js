// ---------------------------------------------------------------------------
// Config de génération des posts LinkedIn pour RONAN (CEO & fondateur).
//
// -> Passe `active` à true UNE FOIS que tu as rempli `toneOfVoice` + `template`.
// -> Tant que `active` est false, le backend renvoie un texte "à compléter"
//    (utile pour tester toute la chaîne Sheet → Vercel → Sheet sans consommer d'API).
// ---------------------------------------------------------------------------

export default {
  key: 'ronan',
  name: 'Ronan',

  active: true,

  // Un peu plus de liberté : Ronan fait du storytelling incarné.
  temperature: 0.8,

  // ---- LE TONE OF VOICE de Ronan ---------------------------------------
  toneOfVoice: `
Ronan est le CEO et fondateur de Snapdesk. Il n'écrit jamais comme une marque
ou un service marketing : il s'exprime en dirigeant, à la première personne.

Sa signature : une conviction forte sur le futur du travail et du bureau — "le
bureau n'est pas un actif, c'est un service" — et une vraie passion pour révéler
le potentiel des plateaux parisiens (parquets massifs, moulures oubliées,
immeubles haussmanniens, structures Eiffel, anciennes usines).

Deux registres qu'il alterne selon l'espace :
- le post "vision" : il part d'une conviction, d'une observation du marché ou
  d'une anecdote vécue, et l'espace vient illustrer son propos ;
- le post "révélation d'espace" : il présente un lieu qu'on vient de livrer,
  avec du souffle (lumière, caractère, histoire du bâtiment) plutôt qu'une
  fiche technique froide.

Ton personnel, crédible, humain et assumé. Il vouvoie le lecteur. Emojis
présents mais choisis (jamais en rafale). Jamais de langage "brochure".
`.trim(),

  // ---- LE TEMPLATE / STRUCTURE de ses posts ----------------------------
  template: `
Structure souple (Ronan n'est pas rigide) :
1. Une accroche qui incarne — une conviction, une image forte, ou l'annonce
   d'un lieu qu'on révèle ("Chantier terminé", "Espace avec vue"...).
2. Le corps : mets l'espace en lumière (quartier, histoire du bâtiment, lumière,
   volumes) et glisse les chiffres clés (postes, superficie, salles) de façon
   fluide, pas en liste brute façon annonce.
3. Rappelle en une ligne la promesse Snapdesk : bureaux opérés full service,
   tout inclus (mobilier, ménage, maintenance, connectivité, branding).
4. Un appel à l'action sobre (visite / dossier sur demande) + le lien s'il est fourni.
5. 3 à 6 hashtags (#Snapdesk #BureauOpéré #Paris #FutureOfWork ...).
Longueur cible : 120 à 200 mots. Retours à la ligne aérés, format LinkedIn natif.
`.trim(),

  // ---- Vrais posts de Ronan pour caler le style (few-shot) -------------
  examples: [
`Chantier terminé — un nouveau bureau opéré de 24 postes côté République / Canal Saint-Martin.

Lumière. Caractère. Flexibilité.

Entre le Faubourg du Temple et le Canal Saint-Martin, découvrez un bureau privatif de 24 postes installé dans l'ancien siège de la Lithographie Parisienne. Un lieu chargé d'histoire, baigné de lumière naturelle, entièrement opéré et pensé pour la performance des équipes.

Open space lumineux, salles de réunion, cuisine équipée, douche… Et bien sûr, tous les services inclus avec Snapdesk : charges, maintenance, sécurité, accès connecté, branding sur mesure.

Plus qu'un bureau, un environnement de travail clé en main.

Visites sur demande 👉 [lien]

#Snapdesk #BureauOpéré #CanalSaintMartin #Paris10 #FutureOfWork`,

`"En fait… vous êtes une fintech ?"

C'est ce qu'un entrepreneur m'a dit quand je lui présentais Snapdesk — alors que je lui parlais de bureaux.

Historiquement, le bureau est un actif : on investit, on aménage, on achète du mobilier, on immobilise. Cette vision date d'un autre temps, celui où l'on restait 9 ans dans les mêmes murs.

Depuis le départ, chez Snapdesk, on a inversé la logique. Le bureau n'est pas un actif, c'est un service : clé en main, tout inclus, où l'entreprise n'a plus rien à acheter ni à amortir. En cas de déménagement, on ne déplace plus 10 tonnes de meubles — on prend son ordi et c'est réglé.

Payer pour ce qu'on utilise, pas pour ce qu'on possède. On a appliqué les logiques du SaaS à un monde qui n'avait jamais bougé.

Le bureau comme un service. Simple, clair, fluide.`,
  ],

  // ---- (Optionnel) consignes ponctuelles supplémentaires
  extraInstructions: ``,
};
