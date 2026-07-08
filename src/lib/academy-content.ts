export type Role = "president" | "tresorier";

export type Article = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "article" | "video";
  duration: string;
  youtubeId?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  points: number;
  articles: Article[];
  quiz: QuizQuestion[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  color: string;
  requirement: string;
};

export type Parcours = {
  id: string;
  title: string;
  description: string;
  badge: Badge;
  missions: Mission[];
};

export type RoleConfig = {
  id: Role;
  title: string;
  subtitle: string;
  icon: "president" | "tresorier";
  color: "blue" | "green";
  parcours: Parcours[];
};

export const ACADEMY_CONTENT: Record<Role, RoleConfig> = {
  president: {
    id: "president",
    title: "Présidente ou président",
    subtitle: "Vous changez la donne, AssoConnect s'occupe du reste.",
    icon: "president",
    color: "blue",
    parcours: [
      {
        id: "gouvernance",
        title: "Gouvernance & stratégie",
        description: "Maîtrisez les fondamentaux pour bien diriger votre association",
        badge: {
          id: "badge-gouvernance",
          name: "Stratège associatif",
          description: "Vous maîtrisez les bases de la gouvernance associative",
          color: "blue",
          requirement: "Compléter le parcours Gouvernance & stratégie",
        },
        missions: [
          {
            id: "mission-creation",
            title: "Créer et structurer son association",
            description: "Les étapes clés pour bien démarrer",
            points: 150,
            articles: [
              {
                id: "art-statuts",
                title: "Comment rédiger les statuts d'une association ?",
                url: "https://www.assoconnect.com/blog/statuts-association",
                description: "Guide complet pour rédiger des statuts solides et conformes à la loi 1901.",
                type: "article",
                duration: "8 min",
              },
              {
                id: "art-reglement",
                title: "Règlement intérieur d'association : questions fréquentes",
                url: "https://www.assoconnect.com/blog/reglement-interieur-association",
                description: "Pourquoi et comment rédiger un règlement intérieur efficace.",
                type: "article",
                duration: "6 min",
              },
              {
                id: "art-bureau",
                title: "Bureau d'association : rôle, pouvoir et procédure d'élection",
                url: "https://www.assoconnect.com/blog/26470-bureau-d-association-quelles-sont-les-regles",
                description: "Composition, attributions et bonnes pratiques du bureau.",
                type: "article",
                duration: "7 min",
              },
              {
                id: "vid-astuces-gestion",
                title: "Webinaire : les astuces pour bien gérer son association",
                url: "https://www.youtube.com/watch?v=wU_i1WtXsQc",
                description: "Un webinaire complet avec les bonnes pratiques de gestion associative au quotidien.",
                type: "video",
                duration: "45 min",
                youtubeId: "wU_i1WtXsQc",
              },
            ],
            quiz: [
              {
                id: "q-loi1901",
                question: "La loi 1901 régit principalement quel type d'organisation ?",
                options: [
                  "Les entreprises commerciales",
                  "Les associations à but non lucratif",
                  "Les collectivités locales",
                  "Les syndicats professionnels",
                ],
                correctIndex: 1,
                explanation: "La loi du 1er juillet 1901 est le texte fondateur des associations en France. Elle s'applique à toute association à but non lucratif réunissant des personnes autour d'un projet commun.",
              },
              {
                id: "q-statuts-obligatoires",
                question: "Parmi ces documents, lequel est indispensable pour déclarer une association en préfecture ?",
                options: [
                  "Le règlement intérieur",
                  "Le procès-verbal de la première réunion",
                  "Les statuts signés",
                  "Un budget prévisionnel",
                ],
                correctIndex: 2,
                explanation: "Les statuts sont le document fondateur obligatoire. Le règlement intérieur et le PV sont utiles mais pas exigés pour la déclaration initiale en préfecture.",
              },
            ],
          },
          {
            id: "mission-ag",
            title: "Organiser une assemblée générale",
            description: "AG ordinaire ou extraordinaire : tout ce qu'il faut savoir",
            points: 200,
            articles: [
              {
                id: "art-ag-ord",
                title: "Assemblée Générale d'association : déroulement et modèle PV",
                url: "https://www.assoconnect.com/blog/4753-les-cles-d-une-assemblee-generale-d-association-reussie",
                description: "Convoquer, préparer et animer une AGO réussie.",
                type: "article",
                duration: "10 min",
              },
              {
                id: "art-ag-ext",
                title: "Assemblée générale extraordinaire : les règles à connaître",
                url: "https://www.assoconnect.com/blog/assemblee-generale-extraordinaire-association",
                description: "Cas d'usage et procédure de l'AGE.",
                type: "article",
                duration: "6 min",
              },
              {
                id: "art-pv-ag",
                title: "Comment rédiger le procès-verbal de son AG ?",
                url: "https://www.assoconnect.com/blog/proces-verbal-ag-association",
                description: "Modèle et conseils pour un PV valide et complet.",
                type: "article",
                duration: "5 min",
              },
            ],
            quiz: [
              {
                id: "q-ag-frequence",
                question: "À quelle fréquence minimum une AGO doit-elle se tenir ?",
                options: [
                  "Tous les 2 ans",
                  "Au moins une fois par an",
                  "Tous les 6 mois",
                  "Uniquement quand il y a une décision importante",
                ],
                correctIndex: 1,
                explanation: "Sauf disposition contraire des statuts, l'assemblée générale ordinaire se réunit au moins une fois par an pour approuver les comptes et le rapport d'activité.",
              },
              {
                id: "q-pv-ag-role",
                question: "À quoi sert le procès-verbal d'une assemblée générale ?",
                options: [
                  "À remplacer les statuts si nécessaire",
                  "À consigner officiellement les décisions prises lors de la réunion",
                  "À informer la préfecture de chaque réunion",
                  "À fixer les cotisations pour l'année suivante",
                ],
                correctIndex: 1,
                explanation: "Le PV est la trace écrite officielle des délibérations et décisions prises en AG. Il a une valeur juridique et peut être exigé par des partenaires ou des financeurs.",
              },
            ],
          },
        ],
      },
      {
        id: "adhesion",
        title: "Gestion des adhérents",
        description: "Recrutez, fidélisez et engagez votre communauté",
        badge: {
          id: "badge-adhesion",
          name: "Ambassadeur communauté",
          description: "Expert en gestion et fidélisation des adhérents",
          color: "green",
          requirement: "Compléter le parcours Gestion des adhérents",
        },
        missions: [
          {
            id: "mission-recruter",
            title: "Recruter de nouveaux adhérents",
            description: "Stratégies et outils pour développer votre base",
            points: 150,
            articles: [
              {
                id: "art-recruter",
                title: "Adhésion d'association : 13 astuces pour booster la rentrée",
                url: "https://www.assoconnect.com/blog/28505-13-astuces-pour-booster-vos-adhesions-a-la-rentree-des-associations",
                description: "Méthodes éprouvées pour attirer et intégrer de nouveaux membres.",
                type: "article",
                duration: "8 min",
              },
              {
                id: "art-accueil",
                title: "Les bonnes pratiques pour bien accueillir un nouveau membre",
                url: "https://www.assoconnect.com/blog/40742-les-bonnes-pratiques-pour-bien-accueillir-un-nouveau-membre/",
                description: "Comment créer une expérience d'accueil mémorable.",
                type: "article",
                duration: "5 min",
              },
              {
                id: "vid-adhesions",
                title: "Tuto : gérer facilement ses adhésions et adhérents",
                url: "https://www.youtube.com/watch?v=4A7IZatOV_Q",
                description: "Comment organiser sa campagne d'adhésion et gagner du temps sur le suivi des membres.",
                type: "video",
                duration: "4 min",
                youtubeId: "4A7IZatOV_Q",
              },
            ],
            quiz: [
              {
                id: "q-recrutement-canal",
                question: "Quel canal est généralement le plus efficace pour recruter de nouveaux adhérents ?",
                options: [
                  "Les publicités en ligne payantes",
                  "Le bouche-à-oreille et les recommandations",
                  "Les affiches dans les commerces",
                  "Les mails non sollicités",
                ],
                correctIndex: 1,
                explanation: "Le bouche-à-oreille reste le levier le plus puissant pour les associations. Un membre satisfait qui parle de l'asso à son entourage convertit bien mieux que n'importe quelle publicité.",
              },
              {
                id: "q-accueil-membre",
                question: "Quelle est la première chose à faire quand un nouveau membre rejoint l'association ?",
                options: [
                  "Lui demander de payer sa cotisation immédiatement",
                  "Le contacter personnellement pour le souhaiter la bienvenue",
                  "Lui envoyer les statuts par email",
                  "L'ajouter directement à tous les groupes WhatsApp",
                ],
                correctIndex: 1,
                explanation: "Un contact personnel et chaleureux à l'arrivée est déterminant pour l'intégration d'un nouveau membre. Cela pose les bases d'une relation de confiance et réduit le risque de départ précoce.",
              },
            ],
          },
          {
            id: "mission-fideliser",
            title: "Fidéliser ses membres et bénévoles",
            description: "Créer un sentiment d'appartenance fort",
            points: 175,
            articles: [
              {
                id: "art-fideliser-benevoles",
                title: "Fidéliser vos bénévoles d'association : 8 conseils pratiques",
                url: "https://www.assoconnect.com/blog/4991-8-conseils-pratiques-pour-fideliser-les-benevoles-de-votre-association",
                description: "Techniques de rétention et d'engagement des membres.",
                type: "article",
                duration: "7 min",
              },
              {
                id: "art-trouver-benevoles",
                title: "Recruter et trouver des bénévoles : 12 plateformes",
                url: "https://www.assoconnect.com/blog/9373-11-plateformes-pour-trouver-des-benevoles-pour-votre-association",
                description: "Les meilleures plateformes pour trouver des bénévoles qualifiés.",
                type: "article",
                duration: "9 min",
              },
              {
                id: "vid-communication",
                title: "Tuto : communiquer efficacement avec ses membres",
                url: "https://www.youtube.com/watch?v=ldNMZLB7QXw",
                description: "Emails ciblés, site web, espace membre : les canaux pour garder le lien avec ta communauté.",
                type: "video",
                duration: "3 min",
                youtubeId: "ldNMZLB7QXw",
              },
            ],
            quiz: [
              {
                id: "q-fidelisation-raison",
                question: "Quelle est la première cause de départ d'un bénévole ?",
                options: [
                  "Le manque de temps personnel",
                  "Le manque de reconnaissance de son engagement",
                  "Les conflits avec d'autres bénévoles",
                  "La distance géographique",
                ],
                correctIndex: 1,
                explanation: "Des études sur l'engagement bénévole montrent que le manque de reconnaissance est le premier frein à la fidélisation. Un simple merci, une mention dans le compte-rendu ou une réunion conviviale font une grande différence.",
              },
              {
                id: "q-fidelisation-cle",
                question: "Pour fidéliser un bénévole sur le long terme, la priorité est de...",
                options: [
                  "Lui confier des missions adaptées à ses compétences et envies",
                  "L'inviter à toutes les réunions",
                  "Lui proposer une compensation financière",
                  "L'inscrire à des formations obligatoires",
                ],
                correctIndex: 0,
                explanation: "L'adéquation mission-compétences est le facteur clé. Un bénévole qui fait quelque chose qui a du sens pour lui et où il se sent utile reste beaucoup plus longtemps.",
              },
            ],
          },
        ],
      },
    ],
  },

  tresorier: {
    id: "tresorier",
    title: "Trésorière ou trésorier",
    subtitle: "La comptabilité n'aura plus de secret pour vous.",
    icon: "tresorier",
    color: "green",
    parcours: [
      {
        id: "comptabilite",
        title: "Comptabilité associative",
        description: "Les bases indispensables pour tenir les comptes de votre asso",
        badge: {
          id: "badge-comptabilite",
          name: "As de la comptabilité",
          description: "Vous maîtrisez la comptabilité associative",
          color: "green",
          requirement: "Compléter le parcours Comptabilité associative",
        },
        missions: [
          {
            id: "mission-bases-compta",
            title: "Les bases de la comptabilité",
            description: "Comprendre les principes fondamentaux",
            points: 200,
            articles: [
              {
                id: "art-compta-asso",
                title: "Comptabilité d'association : le guide pour tout comprendre",
                url: "https://www.assoconnect.com/blog/12133-la-comptabilite-dassociation-pour-les-nouveaux-tresoriers",
                description: "Obligations comptables selon la taille de l'association.",
                type: "article",
                duration: "12 min",
              },
              {
                id: "art-plan-comptes",
                title: "Plan comptable des associations : les clés pour tout comprendre",
                url: "https://www.assoconnect.com/blog/23661-plan-comptable-des-associations-modele-a-telecharger-et-conseils",
                description: "Structure et utilisation du plan comptable associatif.",
                type: "article",
                duration: "8 min",
              },
              {
                id: "art-bilan",
                title: "Bilan comptable d'association : les questions à se poser",
                url: "https://www.assoconnect.com/blog/bilan-comptable-association",
                description: "Actif, passif, résultat : décryptage complet.",
                type: "article",
                duration: "10 min",
              },
              {
                id: "vid-compta-asso",
                title: "Gérez votre comptabilité d'association avec AssoConnect",
                url: "https://www.youtube.com/watch?v=zGX8sAlngyQ",
                description: "Présentation de l'outil de comptabilité AssoConnect en action.",
                type: "video",
                duration: "3 min",
                youtubeId: "zGX8sAlngyQ",
              },
            ],
            quiz: [
              {
                id: "q-bilan-composition",
                question: "Le bilan comptable d'une association se compose de...",
                options: [
                  "Recettes et dépenses uniquement",
                  "Un actif (ce que l'asso possède) et un passif (ce qu'elle doit)",
                  "Un seul tableau de résultats annuels",
                  "Les cotisations perçues et les subventions reçues",
                ],
                correctIndex: 1,
                explanation: "Le bilan est une photographie du patrimoine à un instant T. L'actif recense les ressources (trésorerie, équipements...), le passif les engagements (dettes, réserves...). Les deux colonnes s'équilibrent toujours.",
              },
              {
                id: "q-compta-obligation",
                question: "Une association loi 1901 a-t-elle l'obligation légale de tenir une comptabilité ?",
                options: [
                  "Non, jamais",
                  "Oui, toujours, quelle que soit sa taille",
                  "Oui, dès qu'elle dépasse certains seuils ou reçoit des subventions publiques",
                  "Uniquement si elle emploie des salariés",
                ],
                correctIndex: 2,
                explanation: "La comptabilité devient obligatoire au-delà de certains seuils (ex : subvention publique supérieure à 153 000 €) ou pour les associations reconnues d'utilité publique. Mais même sans obligation, une comptabilité rigoureuse est fortement recommandée.",
              },
            ],
          },
          {
            id: "mission-budget",
            title: "Construire et suivre son budget",
            description: "Prévisionnels, suivi et clôture de l'exercice",
            points: 250,
            articles: [
              {
                id: "art-budget-prev",
                title: "Budget prévisionnel d'une association : comment faire ?",
                url: "https://www.assoconnect.com/blog/27062-etablir-le-budget-previsionnel-de-son-association",
                description: "Méthode pas à pas pour établir votre budget annuel.",
                type: "article",
                duration: "10 min",
              },
              {
                id: "art-rapport-fin",
                title: "Rapport financier de son association : les questions à se poser",
                url: "https://www.assoconnect.com/blog/rapport-financier-association",
                description: "Structure et présentation en assemblée générale.",
                type: "article",
                duration: "7 min",
              },
            ],
            quiz: [
              {
                id: "q-budget-prev-moment",
                question: "À quel moment doit-on établir le budget prévisionnel ?",
                options: [
                  "En fin d'exercice, une fois les comptes clôturés",
                  "Avant le début de l'exercice, pour anticiper les recettes et dépenses",
                  "Uniquement lors de l'assemblée générale",
                  "Quand on cherche une subvention",
                ],
                correctIndex: 1,
                explanation: "Le budget prévisionnel est un outil de pilotage : il se construit en amont pour fixer les objectifs financiers. Le comparer aux réalisations en cours d'année permet de détecter les écarts rapidement.",
              },
              {
                id: "q-excedent",
                question: "Qu'est-ce qu'un excédent dans les comptes d'une association ?",
                options: [
                  "Un profit distribuable aux membres",
                  "Un solde positif quand les produits dépassent les charges",
                  "Une réserve obligatoire imposée par la loi",
                  "Un trop-perçu de cotisations à rembourser",
                ],
                correctIndex: 1,
                explanation: "Contrairement aux entreprises, une association ne peut pas distribuer ses bénéfices. L'excédent (produits - charges > 0) est mis en réserve pour financer des projets futurs ou absorber de futurs déficits.",
              },
            ],
          },
        ],
      },
      {
        id: "cotisations",
        title: "Cotisations & financements",
        description: "Simplifiez la collecte et trouvez des financements",
        badge: {
          id: "badge-cotisations",
          name: "Champion des finances",
          description: "Vous gérez cotisations et financements comme un pro",
          color: "blue",
          requirement: "Compléter le parcours Cotisations & financements",
        },
        missions: [
          {
            id: "mission-cotisations",
            title: "Gérer les cotisations en ligne",
            description: "Paiement en ligne, relances, suivi",
            points: 175,
            articles: [
              {
                id: "art-cotis-ligne",
                title: "Cotisation en ligne pour association : la rentrée sereine",
                url: "https://www.assoconnect.com/blog/cotisations-en-ligne-association-rentree",
                description: "Comment passer au paiement en ligne et simplifier les adhésions.",
                type: "article",
                duration: "6 min",
              },
              {
                id: "art-paiement-ligne",
                title: "Paiement en ligne pour association : 6 avantages",
                url: "https://www.assoconnect.com/blog/paiement-en-ligne-association",
                description: "Pourquoi et comment mettre en place le paiement en ligne.",
                type: "article",
                duration: "7 min",
              },
              {
                id: "art-relances",
                title: "Retard de cotisations : comment relancer vos adhérents ?",
                url: "https://www.assoconnect.com/blog/relancer-adherents-retard-cotisations",
                description: "Processus de relance efficace sans froisser les membres.",
                type: "article",
                duration: "5 min",
              },
            ],
            quiz: [
              {
                id: "q-cotis-avantage",
                question: "Quel est le principal avantage du paiement des cotisations en ligne pour le trésorier ?",
                options: [
                  "Éviter d'avoir un compte bancaire associatif",
                  "Automatiser le suivi des paiements et réduire les impayés",
                  "Supprimer la nécessité d'un logiciel de comptabilité",
                  "Permettre des cotisations en espèces",
                ],
                correctIndex: 1,
                explanation: "Avec le paiement en ligne, chaque transaction est enregistrée automatiquement. Plus besoin de noter les chèques à la main ou de courir après les adhérents : les relances et le suivi sont intégrés.",
              },
              {
                id: "q-relance-cotis",
                question: "Avant d'envoyer une relance pour retard de cotisation, que faut-il vérifier en priorité ?",
                options: [
                  "Que la cotisation n'a pas été augmentée depuis l'an dernier",
                  "Que le membre a bien reçu sa facture et les informations de paiement",
                  "Que l'association a bien un compte Paypal",
                  "Que le bureau a voté pour la relance",
                ],
                correctIndex: 1,
                explanation: "Beaucoup d'impayés sont dus à une simple absence de réception de la facture ou à une confusion sur les modalités de paiement. Vérifier ce point avant de relancer évite des malentendus inutiles.",
              },
            ],
          },
          {
            id: "mission-subventions",
            title: "Subventions et financements",
            description: "Identifier et obtenir des financements publics",
            points: 225,
            articles: [
              {
                id: "art-subventions",
                title: "Trouver les subventions et appels à projets pour votre association",
                url: "https://www.assoconnect.com/blog/subvention-association",
                description: "Types de subventions, comment les obtenir et les justifier.",
                type: "article",
                duration: "11 min",
              },
              {
                id: "art-dossier-subv",
                title: "Demande de subvention pour son association : nos conseils",
                url: "https://www.assoconnect.com/blog/demande-subvention-association",
                description: "Comment monter un dossier convaincant étape par étape.",
                type: "article",
                duration: "9 min",
              },
              {
                id: "art-financement",
                title: "Financement association : 11 solutions à mettre en œuvre",
                url: "https://www.assoconnect.com/blog/24777-financement-des-associations-explorez-les-possibles",
                description: "Tour d'horizon de toutes les sources de financement disponibles.",
                type: "article",
                duration: "10 min",
              },
            ],
            quiz: [
              {
                id: "q-subvention-definition",
                question: "Une subvention publique accordée à une association doit être...",
                options: [
                  "Remboursée avec des intérêts si l'association fait un excédent",
                  "Utilisée conformément à l'objet pour lequel elle a été attribuée",
                  "Déclarée comme revenu imposable",
                  "Partagée à parts égales entre les membres du bureau",
                ],
                correctIndex: 1,
                explanation: "Une subvention est une aide avec contrepartie d'usage : elle doit financer l'action ou le projet pour lequel elle a été demandée. Un détournement d'usage peut entraîner un remboursement voire des poursuites.",
              },
              {
                id: "q-subvention-etape",
                question: "Quelle est la première étape pour obtenir une subvention ?",
                options: [
                  "Rédiger un dossier très détaillé",
                  "Identifier les financeurs potentiels adaptés au projet",
                  "Déposer une demande auprès de tous les organismes possibles",
                  "Obtenir d'abord le soutien d'un élu local",
                ],
                correctIndex: 1,
                explanation: "Avant de rédiger quoi que ce soit, il faut cibler les bons financeurs : mairie, département, région, fondations privées... Chaque financeur a ses critères et ses calendriers. Un dossier bien ciblé a beaucoup plus de chances d'aboutir.",
              },
            ],
          },
        ],
      },
    ],
  },
};

export function getTotalPoints(role: RoleConfig): number {
  return role.parcours
    .flatMap((p) => p.missions)
    .reduce((sum, m) => sum + m.points, 0);
}

export function getParcoursPoints(parcours: Parcours): number {
  return parcours.missions.reduce((sum, m) => sum + m.points, 0);
}

export function getAllArticleIds(role: RoleConfig): string[] {
  return role.parcours
    .flatMap((p) => p.missions)
    .flatMap((m) => m.articles)
    .map((a) => a.id);
}

export function getAllQuizIds(role: RoleConfig): string[] {
  return role.parcours
    .flatMap((p) => p.missions)
    .flatMap((m) => m.quiz)
    .map((q) => q.id);
}

// Keep backward compat aliases
export const getTotalXP = getTotalPoints;
export const getParcoursXP = getParcoursPoints;
