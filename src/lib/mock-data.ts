export const DEMO_ASSOCIATION = {
  name: "Les Amis du Jardin Partagé",
  year: 2025,
  previousYear: 2024,
  members: { current: 153, previous: 127 },
  volunteers: { total: 28, active: 22 },
  events: [
    { name: "Assemblée Générale 2024", date: "2025-01-18", participants: 41, category: "gouvernance" },
    { name: "Grande journée de plantation", date: "2025-03-22", participants: 87, category: "activité" },
    { name: "Atelier compostage", date: "2025-04-12", participants: 24, category: "formation" },
    { name: "Fête du jardin", date: "2025-05-18", participants: 145, category: "événement" },
    { name: "Sortie botanique", date: "2025-06-07", participants: 32, category: "sortie" },
    { name: "Chantier aménagement serre", date: "2025-07-05", participants: 18, category: "chantier" },
    { name: "Marché de légumes", date: "2025-08-24", participants: 203, category: "événement" },
    { name: "Formation permaculture", date: "2025-09-13", participants: 28, category: "formation" },
    { name: "Récolte et partage", date: "2025-10-04", participants: 67, category: "activité" },
    { name: "Atelier conservation", date: "2025-10-25", participants: 19, category: "formation" },
    { name: "Journée biodiversité", date: "2025-11-08", participants: 52, category: "activité" },
    { name: "Bilan de fin d'année", date: "2025-12-06", participants: 24, category: "gouvernance" },
  ],
  finance: {
    revenue: { donations: 8450, grants: 12000, membershipFees: 3060, other: 890 },
    expenses: { activities: 8200, equipment: 4300, communication: 1200, admin: 2400 },
    surplus: 2300,
  },
  partners: [
    { name: "Mairie du 11ème arrondissement", type: "Collectivité locale" },
    { name: "Fondation de France", type: "Fondation" },
    { name: "Biocoop Bastille", type: "Partenaire commercial" },
    { name: "École primaire Jules Ferry", type: "Partenaire éducatif" },
  ],
  topVolunteers: [
    { name: "Marie Dupont", role: "Responsable jardinage", hours: 180 },
    { name: "Ahmed Benali", role: "Animateur ateliers", hours: 145 },
    { name: "Sophie Martin", role: "Trésorière", hours: 120 },
    { name: "Luc Bernard", role: "Responsable communication", hours: 95 },
    { name: "Fatima Okoye", role: "Coordinatrice bénévoles", hours: 88 },
  ],
  mission: "Créer et animer un espace de jardinage partagé pour favoriser le lien social, la biodiversité urbaine et l'éducation à l'environnement dans notre quartier.",
  values: ["Partage", "Solidarité", "Écologie", "Transmission"],
}

export const INTERVIEW_QUESTIONS = [
  {
    id: "successes",
    question: "Quels ont été vos plus grands succès cette année ?",
    placeholder: "Ex : La fête du jardin a rassemblé plus de monde que jamais, notre serre est enfin opérationnelle...",
    hint: "Pensez aux moments dont vous êtes le plus fiers"
  },
  {
    id: "challenges",
    question: "Quels défis avez-vous rencontrés ?",
    placeholder: "Ex : La sécheresse estivale a compliqué l'entretien, nous avons manqué de bénévoles en été...",
    hint: "Les défis font partie de l'histoire"
  },
  {
    id: "failures",
    question: "Qu'est-ce qui n'a pas fonctionné comme prévu ?",
    placeholder: "Ex : Le projet de ruches a dû être abandonné faute de budget, l'atelier enfants a eu peu de succès...",
    hint: "L'honnêteté renforce la crédibilité de votre rapport"
  },
  {
    id: "volunteers_recognition",
    question: "Quels bénévoles méritent d'être mis en valeur ?",
    placeholder: "Ex : Marie a consacré chaque week-end à l'entretien, Ahmed a animé 8 ateliers cette année...",
    hint: "La reconnaissance des bénévoles est essentielle"
  },
  {
    id: "community_impact",
    question: "Quel impact avez-vous eu sur votre communauté ?",
    placeholder: "Ex : Nous avons touché 3 écoles du quartier, créé des liens entre les générations...",
    hint: "Pensez aux personnes touchées au-delà de vos membres"
  },
  {
    id: "lessons_learned",
    question: "Quelles leçons retenez-vous de cette année ?",
    placeholder: "Ex : Il faut mieux planifier les rotations de bénévoles, communiquer plus tôt sur les événements...",
    hint: "Ces apprentissages guideront l'année prochaine"
  },
  {
    id: "future_priorities",
    question: "Quelles sont vos priorités pour l'année prochaine ?",
    placeholder: "Ex : Agrandir la serre, recruter 10 nouveaux bénévoles, lancer un composteur collectif...",
    hint: "Partagez votre vision avec vos membres"
  },
  {
    id: "president_message",
    question: "Quel message souhaitez-vous adresser à vos membres ?",
    placeholder: "Ex : Chers membres, cette année a été marquée par votre engagement exceptionnel...",
    hint: "Ce sera votre mot d'introduction dans le rapport"
  },
]

export const SECTION_CONTRIBUTORS = [
  { id: "jardinage", name: "Activités jardinage", leader: "Marie Dupont", email: "marie@jardinage.fr", icon: "🌱" },
  { id: "ateliers", name: "Ateliers & formations", leader: "Ahmed Benali", email: "ahmed@jardinage.fr", icon: "📚" },
  { id: "communication", name: "Communication", leader: "Luc Bernard", email: "luc@jardinage.fr", icon: "📢" },
  { id: "benevoles", name: "Coordination bénévoles", leader: "Fatima Okoye", email: "fatima@jardinage.fr", icon: "🤝" },
]

export const REPORT_SECTIONS = [
  { id: "president_message", title: "Mot du président", icon: "💬" },
  { id: "mission", title: "Notre mission et nos valeurs", icon: "🌟" },
  { id: "members_volunteers", title: "Membres et bénévoles", icon: "👥" },
  { id: "activities", title: "Activités et impact", icon: "🌱" },
  { id: "partnerships", title: "Partenariats", icon: "🤝" },
  { id: "finance", title: "Bilan financier", icon: "💰" },
  { id: "challenges", title: "Défis et apprentissages", icon: "📈" },
  { id: "outlook", title: "Perspectives", icon: "🔭" },
]
