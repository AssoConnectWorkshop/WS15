export type Role = "president" | "tresorier";

export type Article = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "article" | "video" | "webinar";
  duration: string;
  youtubeId?: string; // YouTube video ID for embedded player
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
  xp: number;
  quizXp: number;
  articles: Article[];
  quiz: QuizQuestion[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
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
  emoji: string;
  color: string;
  gradient: string;
  parcours: Parcours[];
};

export const ACADEMY_CONTENT: Record<Role, RoleConfig> = {
  president: {
    id: "president",
    title: "Président·e",
    subtitle: "Pilotez votre association avec confiance",
    emoji: "🏛️",
    color: "violet",
    gradient: "from-violet-600 to-purple-700",
    parcours: [
      {
        id: "gouvernance",
        title: "Gouvernance & stratégie",
        description: "Maîtrisez les fondamentaux pour bien diriger votre association",
        badge: {
          id: "badge-gouvernance",
          name: "Stratège associatif",
          description: "Vous maîtrisez les bases de la gouvernance associative",
          emoji: "🎯",
          color: "violet",
          requirement: "Compléter le parcours Gouvernance & stratégie",
        },
        missions: [
          {
            id: "mission-creation",
            title: "Créer et structurer son association",
            description: "Les étapes clés pour bien démarrer",
            xp: 150,
            quizXp: 75,
            articles: [
              {
                id: "art-statuts",
                title: "Comment rédiger les statuts de son association ?",
                url: "https://www.assoconnect.com/blog/rediger-statuts-association/",
                description: "Guide complet pour rédiger des statuts solides et conformes à la loi 1901.",
                type: "article",
                duration: "8 min",
              },
              {
                id: "art-reglement",
                title: "Le règlement intérieur d'une association",
                url: "https://www.assoconnect.com/blog/reglement-interieur-association/",
                description: "Pourquoi et comment rédiger un règlement intérieur efficace.",
                type: "article",
                duration: "6 min",
              },
              {
                id: "vid-creer-asso",
                title: "Créer son association de A à Z",
                url: "https://www.youtube.com/@assoconnect",
                description: "Tutoriel vidéo complet sur les démarches de création d'une association loi 1901.",
                type: "video",
                duration: "12 min",
                youtubeId: "TODO_REPLACE", // Remplacer par l'ID de la vidéo youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-statuts-1",
                question: "Combien de personnes minimum sont nécessaires pour créer une association loi 1901 ?",
                options: ["1 personne", "2 personnes", "3 personnes", "5 personnes"],
                correctIndex: 1,
                explanation: "La loi 1901 exige au minimum 2 personnes pour créer une association.",
              },
              {
                id: "q-statuts-2",
                question: "Quel document définit le fonctionnement interne détaillé d'une association (réunions, votes, sanctions...) ?",
                options: ["Les statuts", "Le règlement intérieur", "Le procès-verbal", "La déclaration en préfecture"],
                correctIndex: 1,
                explanation: "Le règlement intérieur précise les modalités de fonctionnement que les statuts n'abordent pas en détail.",
              },
              {
                id: "q-statuts-3",
                question: "Où doit-on déposer la déclaration de création d'une association ?",
                options: ["À la mairie", "Au tribunal", "En préfecture ou sous-préfecture", "À la chambre de commerce"],
                correctIndex: 2,
                explanation: "La déclaration se fait en préfecture ou sous-préfecture du siège social de l'association.",
              },
            ],
          },
          {
            id: "mission-ag",
            title: "Organiser une assemblée générale",
            description: "AG ordinaire ou extraordinaire : tout ce qu'il faut savoir",
            xp: 200,
            quizXp: 100,
            articles: [
              {
                id: "art-ag-ord",
                title: "L'assemblée générale ordinaire : mode d'emploi",
                url: "https://www.assoconnect.com/blog/assemblee-generale-ordinaire/",
                description: "Convoquer, préparer et animer une AGO réussie.",
                type: "article",
                duration: "10 min",
              },
              {
                id: "art-pv-ag",
                title: "Rédiger le procès-verbal d'une assemblée générale",
                url: "https://www.assoconnect.com/blog/proces-verbal-assemblee-generale/",
                description: "Modèle et conseils pour un PV valide.",
                type: "article",
                duration: "5 min",
              },
              {
                id: "vid-ag",
                title: "Comment organiser une assemblée générale ?",
                url: "https://www.youtube.com/@assoconnect",
                description: "Les étapes clés pour préparer et animer une AG réussie, expliquées en vidéo.",
                type: "video",
                duration: "8 min",
                youtubeId: "TODO_ag", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-ag-1",
                question: "Quel est le délai de convocation minimum recommandé avant une assemblée générale ?",
                options: ["3 jours", "8 jours", "15 jours", "1 mois"],
                correctIndex: 2,
                explanation: "Il est recommandé de convoquer les membres au moins 15 jours avant l'AG (sauf disposition contraire des statuts).",
              },
              {
                id: "q-ag-2",
                question: "Qui rédige le procès-verbal de l'assemblée générale ?",
                options: ["Le président", "Le trésorier", "Le secrétaire", "Un huissier"],
                correctIndex: 2,
                explanation: "C'est généralement le secrétaire qui rédige et signe le procès-verbal de l'AG.",
              },
              {
                id: "q-ag-3",
                question: "Pour quelle raison principale convoque-t-on une assemblée générale extraordinaire ?",
                options: [
                  "Pour approuver les comptes annuels",
                  "Pour modifier les statuts ou dissoudre l'association",
                  "Pour élire le bureau",
                  "Pour voter le budget prévisionnel",
                ],
                correctIndex: 1,
                explanation: "L'AGE est convoquée pour des décisions exceptionnelles : modification des statuts, dissolution, fusion.",
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
          emoji: "🤝",
          color: "blue",
          requirement: "Compléter le parcours Gestion des adhérents",
        },
        missions: [
          {
            id: "mission-recruter",
            title: "Recruter de nouveaux adhérents",
            description: "Stratégies et outils pour développer votre base",
            xp: 150,
            quizXp: 75,
            articles: [
              {
                id: "art-recruter",
                title: "10 idées pour recruter des adhérents",
                url: "https://www.assoconnect.com/blog/recruter-adherents-association/",
                description: "Méthodes éprouvées pour attirer de nouveaux membres.",
                type: "article",
                duration: "8 min",
              },
              {
                id: "art-bulletin",
                title: "Bulletin d'adhésion : tout ce qu'il doit contenir",
                url: "https://www.assoconnect.com/blog/bulletin-adhesion-association/",
                description: "Mentions obligatoires et bonnes pratiques.",
                type: "article",
                duration: "5 min",
              },
              {
                id: "vid-adherents",
                title: "Gérer ses adhérents avec AssoConnect",
                url: "https://www.youtube.com/@assoconnect",
                description: "Découvrez comment centraliser et gérer votre base d'adhérents dans AssoConnect.",
                type: "video",
                duration: "6 min",
                youtubeId: "TODO_adherents", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-recruit-1",
                question: "Quelle mention est obligatoire sur un bulletin d'adhésion ?",
                options: [
                  "La photo du membre",
                  "La mention RGPD sur l'utilisation des données",
                  "Le numéro de sécurité sociale",
                  "Le QI du membre",
                ],
                correctIndex: 1,
                explanation: "Depuis le RGPD, le bulletin doit informer les membres sur l'utilisation de leurs données personnelles.",
              },
              {
                id: "q-recruit-2",
                question: "Quel canal est généralement le plus efficace pour recruter de nouveaux adhérents ?",
                options: [
                  "La publicité payante en ligne",
                  "Le bouche-à-oreille et la recommandation",
                  "Les flyers dans les boîtes aux lettres",
                  "La télévision locale",
                ],
                correctIndex: 1,
                explanation: "Le bouche-à-oreille reste le canal de recrutement le plus efficace pour les associations.",
              },
            ],
          },
          {
            id: "mission-fideliser",
            title: "Fidéliser ses membres",
            description: "Créer un sentiment d'appartenance fort",
            xp: 175,
            quizXp: 88,
            articles: [
              {
                id: "art-fideliser",
                title: "Comment fidéliser ses adhérents ?",
                url: "https://www.assoconnect.com/blog/fideliser-adherents-association/",
                description: "Techniques de rétention et d'engagement des membres.",
                type: "article",
                duration: "7 min",
              },
              {
                id: "art-benevolat",
                title: "Gérer et motiver ses bénévoles",
                url: "https://www.assoconnect.com/blog/gerer-benevoles-association/",
                description: "Management associatif et valorisation du bénévolat.",
                type: "article",
                duration: "9 min",
              },
              {
                id: "vid-benevoles",
                title: "Motiver et fidéliser ses bénévoles",
                url: "https://www.youtube.com/@assoconnect",
                description: "Conseils pratiques pour engager durablement vos bénévoles.",
                type: "video",
                duration: "9 min",
                youtubeId: "TODO_benevoles", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-fidel-1",
                question: "Quel est le principal facteur de départ d'un bénévole selon les études ?",
                options: [
                  "Le manque de reconnaissance",
                  "Les horaires trop chargés",
                  "Les conflits avec les adhérents",
                  "Le manque de matériel",
                ],
                correctIndex: 0,
                explanation: "Le manque de reconnaissance est la première cause de départ des bénévoles. Valoriser leur engagement est essentiel.",
              },
              {
                id: "q-fidel-2",
                question: "Quelle pratique favorise le plus la fidélisation des adhérents ?",
                options: [
                  "Baisser le prix de la cotisation chaque année",
                  "Créer des événements exclusifs pour les membres anciens",
                  "Impliquer les membres dans la vie et les décisions de l'association",
                  "Envoyer des newsletters très fréquentes",
                ],
                correctIndex: 2,
                explanation: "L'implication des membres dans les décisions crée un fort sentiment d'appartenance et réduit le taux de départ.",
              },
            ],
          },
        ],
      },
    ],
  },

  tresorier: {
    id: "tresorier",
    title: "Trésorier·e",
    subtitle: "Maîtrisez les finances de votre association",
    emoji: "💰",
    color: "emerald",
    gradient: "from-emerald-600 to-teal-700",
    parcours: [
      {
        id: "comptabilite",
        title: "Comptabilité associative",
        description: "Les bases indispensables pour tenir les comptes de votre asso",
        badge: {
          id: "badge-comptabilite",
          name: "Expert comptable asso",
          description: "Vous maîtrisez la comptabilité associative",
          emoji: "📊",
          color: "emerald",
          requirement: "Compléter le parcours Comptabilité associative",
        },
        missions: [
          {
            id: "mission-bases-compta",
            title: "Les bases de la comptabilité",
            description: "Comprendre les principes fondamentaux",
            xp: 200,
            quizXp: 100,
            articles: [
              {
                id: "art-compta-asso",
                title: "La comptabilité d'une association : guide complet",
                url: "https://www.assoconnect.com/blog/comptabilite-association/",
                description: "Obligations comptables selon la taille de l'association.",
                type: "article",
                duration: "12 min",
              },
              {
                id: "art-plan-comptes",
                title: "Le plan comptable des associations",
                url: "https://www.assoconnect.com/blog/plan-comptable-association/",
                description: "Structure et utilisation du plan comptable associatif.",
                type: "article",
                duration: "8 min",
              },
              {
                id: "vid-compta-bases",
                title: "La comptabilité associative expliquée simplement",
                url: "https://www.youtube.com/@assoconnect",
                description: "Introduction aux grands principes de la comptabilité pour les associations.",
                type: "video",
                duration: "11 min",
                youtubeId: "TODO_compta_bases", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-compta-1",
                question: "À partir de quel seuil de ressources une association est-elle obligée de nommer un commissaire aux comptes ?",
                options: ["153 000 €", "1 530 000 €", "3 100 000 €", "Toutes les associations"],
                correctIndex: 1,
                explanation: "Une association qui reçoit plus de 153 000 € de subventions publiques ou dépasse 1 530 000 € de ressources doit nommer un CAC.",
              },
              {
                id: "q-compta-2",
                question: "Que représente l'actif dans le bilan d'une association ?",
                options: [
                  "Les dettes de l'association",
                  "Les ressources financières disponibles",
                  "Ce que l'association possède (biens, créances, trésorerie)",
                  "Le résultat de l'exercice",
                ],
                correctIndex: 2,
                explanation: "L'actif représente tout ce que l'association possède : immobilisations, stocks, créances et trésorerie.",
              },
              {
                id: "q-compta-3",
                question: "Qu'est-ce que le principe de prudence en comptabilité ?",
                options: [
                  "Ne pas dépenser plus que le budget prévu",
                  "Comptabiliser les pertes probables mais pas les gains incertains",
                  "Conserver tous les justificatifs pendant 10 ans",
                  "Ne pas contracter de dettes",
                ],
                correctIndex: 1,
                explanation: "Le principe de prudence impose de comptabiliser les risques et pertes probables, mais pas les profits hypothétiques.",
              },
            ],
          },
          {
            id: "mission-budget",
            title: "Construire et suivre son budget",
            description: "Prévisionnels, suivi et clôture de l'exercice",
            xp: 250,
            quizXp: 125,
            articles: [
              {
                id: "art-budget-prev",
                title: "Comment construire le budget prévisionnel ?",
                url: "https://www.assoconnect.com/blog/budget-previsionnel-association/",
                description: "Méthode pas à pas pour établir votre budget annuel.",
                type: "article",
                duration: "10 min",
              },
              {
                id: "art-rapport-fin",
                title: "Le rapport financier de l'association",
                url: "https://www.assoconnect.com/blog/rapport-financier-association/",
                description: "Structure et présentation en assemblée générale.",
                type: "article",
                duration: "7 min",
              },
              {
                id: "vid-budget",
                title: "Créer un budget prévisionnel avec AssoConnect",
                url: "https://www.youtube.com/@assoconnect",
                description: "Tutoriel pour construire et suivre votre budget dans AssoConnect.",
                type: "video",
                duration: "10 min",
                youtubeId: "TODO_budget", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-budget-1",
                question: "Quand le budget prévisionnel est-il généralement soumis au vote ?",
                options: [
                  "À l'assemblée générale ordinaire",
                  "À l'assemblée générale extraordinaire",
                  "Lors d'une réunion de bureau",
                  "Il n'est pas obligatoire de le voter",
                ],
                correctIndex: 0,
                explanation: "Le budget prévisionnel est classiquement présenté et voté lors de l'AGO, en même temps que les comptes de l'exercice précédent.",
              },
              {
                id: "q-budget-2",
                question: "Qu'est-ce qu'un résultat déficitaire pour une association ?",
                options: [
                  "Les dépenses sont supérieures aux recettes",
                  "L'association n'a pas de trésorerie",
                  "Les recettes sont supérieures aux dépenses",
                  "L'association a des dettes",
                ],
                correctIndex: 0,
                explanation: "Un résultat déficitaire signifie que les charges de l'exercice dépassent les produits. À ne pas confondre avec une absence de trésorerie.",
              },
            ],
          },
        ],
      },
      {
        id: "cotisations",
        title: "Cotisations & paiements",
        description: "Simplifiez la collecte et le suivi des paiements",
        badge: {
          id: "badge-cotisations",
          name: "Maître des cotisations",
          description: "Vous gérez cotisations et paiements comme un pro",
          emoji: "💳",
          color: "blue",
          requirement: "Compléter le parcours Cotisations & paiements",
        },
        missions: [
          {
            id: "mission-cotisations",
            title: "Fixer et gérer les cotisations",
            description: "Montants, modes de paiement, relances",
            xp: 175,
            quizXp: 88,
            articles: [
              {
                id: "art-fixer-cotis",
                title: "Comment fixer le montant des cotisations ?",
                url: "https://www.assoconnect.com/blog/fixer-cotisation-association/",
                description: "Critères et méthodes pour définir une cotisation juste.",
                type: "article",
                duration: "6 min",
              },
              {
                id: "art-paiement-ligne",
                title: "Le paiement en ligne pour les associations",
                url: "https://www.assoconnect.com/blog/paiement-en-ligne-association/",
                description: "Avantages et mise en place du paiement en ligne.",
                type: "article",
                duration: "7 min",
              },
              {
                id: "vid-paiement",
                title: "Collecter les cotisations en ligne avec AssoConnect",
                url: "https://www.youtube.com/@assoconnect",
                description: "Comment activer et utiliser le paiement en ligne pour vos adhésions.",
                type: "video",
                duration: "7 min",
                youtubeId: "TODO_paiement", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-cotis-1",
                question: "La cotisation d'une association est-elle obligatoirement la même pour tous les membres ?",
                options: [
                  "Oui, elle doit être identique pour tous",
                  "Non, les statuts peuvent prévoir des tarifs différenciés",
                  "Non, mais seulement pour les moins de 18 ans",
                  "Oui, sinon c'est discriminatoire",
                ],
                correctIndex: 1,
                explanation: "Les statuts peuvent prévoir des tarifs différenciés (tarif réduit, famille, bienfaiteur...) tant que les critères sont objectifs.",
              },
              {
                id: "q-cotis-2",
                question: "Quel avantage principal offre le paiement en ligne pour une association ?",
                options: [
                  "Il évite de payer des frais bancaires",
                  "Il automatise les relances et la comptabilité",
                  "Il est obligatoire pour les associations de plus de 50 membres",
                  "Il supprime le besoin d'un bulletin d'adhésion",
                ],
                correctIndex: 1,
                explanation: "Le paiement en ligne automatise la collecte, les relances et la réconciliation comptable, réduisant fortement la charge administrative.",
              },
            ],
          },
          {
            id: "mission-subventions",
            title: "Subventions et financements",
            description: "Identifier et obtenir des financements publics",
            xp: 225,
            quizXp: 113,
            articles: [
              {
                id: "art-subventions",
                title: "Les subventions pour les associations : guide complet",
                url: "https://www.assoconnect.com/blog/subvention-association/",
                description: "Types de subventions, comment les obtenir et les justifier.",
                type: "article",
                duration: "11 min",
              },
              {
                id: "art-dossier-subv",
                title: "Monter un dossier de subvention",
                url: "https://www.assoconnect.com/blog/dossier-subvention-association/",
                description: "Structure et conseils pour un dossier convaincant.",
                type: "article",
                duration: "9 min",
              },
              {
                id: "vid-subventions",
                title: "Obtenir des subventions pour son association",
                url: "https://www.youtube.com/@assoconnect",
                description: "Les clés pour identifier les financements disponibles et monter un dossier solide.",
                type: "video",
                duration: "14 min",
                youtubeId: "TODO_subventions", // ← Remplacer par l\'ID vidéo depuis youtube.com/@assoconnect
              },
            ],
            quiz: [
              {
                id: "q-subv-1",
                question: "Quelle est la différence entre une subvention et un don ?",
                options: [
                  "Il n'y a aucune différence",
                  "La subvention vient d'un organisme public, le don d'un particulier ou entreprise",
                  "La subvention est remboursable, le don ne l'est pas",
                  "Le don est fiscalement déductible, la subvention non",
                ],
                correctIndex: 1,
                explanation: "Une subvention est attribuée par une collectivité ou l'État. Un don provient d'un particulier ou d'une entreprise (mécénat).",
              },
              {
                id: "q-subv-2",
                question: "Quel document est généralement exigé pour justifier l'utilisation d'une subvention ?",
                options: [
                  "Un simple email de remerciement",
                  "Un compte rendu financier d'utilisation de la subvention",
                  "Les statuts de l'association",
                  "Le procès-verbal de la dernière AG",
                ],
                correctIndex: 1,
                explanation: "Le compte rendu financier est obligatoire pour les subventions dépassant 23 000 €. Il détaille comment les fonds ont été utilisés.",
              },
            ],
          },
        ],
      },
    ],
  },
};

export function getTotalXP(role: RoleConfig): number {
  return role.parcours.flatMap((p) => p.missions).reduce((sum, m) => sum + m.xp + m.quizXp, 0);
}

export function getParcoursXP(parcours: Parcours): number {
  return parcours.missions.reduce((sum, m) => sum + m.xp + m.quizXp, 0);
}

export function getAllArticleIds(role: RoleConfig): string[] {
  return role.parcours
    .flatMap((p) => p.missions)
    .flatMap((m) => m.articles)
    .map((a) => a.id);
}
