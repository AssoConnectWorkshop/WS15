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

export type Mission = {
  id: string;
  title: string;
  description: string;
  points: number;
  articles: Article[];
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
                id: "vid-assoconnect-intro",
                title: "AssoConnect : le logiciel de gestion pour associations",
                url: "https://www.youtube.com/watch?v=vtmHKFgcebo",
                description: "Découvrez comment AssoConnect simplifie la gestion de votre association.",
                type: "video",
                duration: "2 min",
                youtubeId: "vtmHKFgcebo",
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

// Keep backward compat aliases
export const getTotalXP = getTotalPoints;
export const getParcoursXP = getParcoursPoints;
