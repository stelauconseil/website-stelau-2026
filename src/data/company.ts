// Acquisition mi-juin 2026, annoncée par iDAKTO le 16 juin 2026.
// Communiqué : https://www.idakto.com/blog/idakto-accelerates-its-growth-with-the-acquisition-of-stelau-specialist-in-cybersecurity-for-digital-identity-infrastructure/
export const group = {
  name: 'iDAKTO',
  fr: {
    website: 'https://www.idakto.com/fr/',
    announcement: 'https://www.linkedin.com/posts/stelau-rejoint-idakto-et-ce-nest-pas-share-7472685710064513025-cKxP/',
    period: 'Mi-juin 2026',
    title: 'Stelau rejoint iDAKTO !',
    description: 'Nous sommes heureux de rejoindre le groupe iDAKTO et d’ouvrir ensemble un nouveau chapitre de notre histoire. Nos expertises en cybersécurité, audit et conseil rencontrent celles d’un acteur de l’identité numérique souveraine.',
    affiliation: 'Une société du groupe iDAKTO',
    cta: 'Lire notre annonce sur LinkedIn',
  },
  en: {
    website: 'https://www.idakto.com/',
    announcement: 'https://www.linkedin.com/posts/stelau-conseil_stelau-joins-idakto-and-its-no-coincidence-activity-7472686138110169089-HdIP',
    period: 'Mid-June 2026',
    title: 'Stelau joins iDAKTO!',
    description: 'We are delighted to join the iDAKTO group and begin a new chapter together. Our expertise in cybersecurity, audits and consulting meets that of a sovereign digital identity specialist.',
    affiliation: 'Part of the iDAKTO group',
    cta: 'Read our announcement on LinkedIn',
  },
};

// Implantations Stelau, communes aux pages FR/EN.
export const companyLocations = ['Paris XIII', 'Paris XVI', 'Guyancourt', 'Angers'] as const;
export const companyContact = {
  locations: companyLocations,
  locationsLabel: companyLocations.join(' - '),
  country: 'France',
  phone: '+33185401270',
  phoneLabel: '+33 1 85 40 12 70',
};
export const locationMapUrl = (city: string) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${city}, France`)}`;
