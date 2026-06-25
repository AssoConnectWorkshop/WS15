export type Role = "president" | "tresorier";

export type Article = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "article" | "video" | "webinar";
  duration: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  xp: number;
  articles: Article[];
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
    title: "Présidente ou président",
    subtitle: "Vous changez la donne, AssoConnect s'occupe du reste.",
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
                id: "art-ca",
                title: "Conseil d'administration : rôles et fonctionnement",
                url: "https://www.assoconnect.com/blog/conseil-administration-association/",
                description: "Composition, attributions et bonnes pratiques du CA.",
                type: "article",
                duration: "7 min",
              },
            ],
          },
          {
            id: "mission-ag",
            title: "Organiser une assemblée générale",
            description: "AG ordinaire ou extraordinaire : tout ce qu'il faut savoir",
            xp: 200,
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
                id: "art-ag-ext",
                title: "Assemblée générale extraordinaire : quand et comment ?",
                url: "https://www.assoconnect.com/blog/assemblee-generale-extraordinaire/",
                description: "Cas d'usage et procédure de l'AGE.",
                type: "article",
                duration: "6 min",
              },
              {
                id: "art-pv-ag",
                title: "Rédiger le procès-verbal d'une assemblée générale",
                url: "https://www.assoconnect.com/blog/proces-verbal-assemblee-generale/",
                description: "Modèle et conseils pour un PV valide.",
                type: "article",
                duration: "5 min",
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
            ],
          },
          {
            id: "mission-fideliser",
            title: "Fidéliser ses membres",
            description: "Créer un sentiment d'appartenance fort",
            xp: 175,
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
                id: "art-bilan",
                title: "Lire et interpréter un bilan associatif",
                url: "https://www.assoconnect.com/blog/bilan-association/",
                description: "Actif, passif, résultat : décryptage complet.",
                type: "article",
                duration: "10 min",
              },
            ],
          },
          {
            id: "mission-budget",
            title: "Construire et suivre son budget",
            description: "Prévisionnels, suivi et clôture de l'exercice",
            xp: 250,
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
                id: "art-relances",
                title: "Gérer les impayés et relancer ses adhérents",
                url: "https://www.assoconnect.com/blog/relance-cotisation-association/",
                description: "Processus de relance efficace sans froisser les membres.",
                type: "article",
                duration: "5 min",
              },
            ],
          },
          {
            id: "mission-subventions",
            title: "Subventions et financements",
            description: "Identifier et obtenir des financements publics",
            xp: 225,
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
            ],
          },
        ],
      },
    ],
  },
};

export function getTotalXP(role: RoleConfig): number {
  return role.parcours
    .flatMap((p) => p.missions)
    .reduce((sum, m) => sum + m.xp, 0);
}

export function getParcoursXP(parcours: Parcours): number {
  return parcours.missions.reduce((sum, m) => sum + m.xp, 0);
}

export function getAllArticleIds(role: RoleConfig): string[] {
  return role.parcours
    .flatMap((p) => p.missions)
    .flatMap((m) => m.articles)
    .map((a) => a.id);
}
