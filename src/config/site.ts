export type Locale = 'fr' | 'en';
export type Route = 'training' | 'openidTraining' | 'home' | 'expertise' | 'cases' | 'about' | 'blog' | 'contact' | 'notice' | 'privacy' | 'cookies' | 'terms';
const paths: Record<Locale, Record<Route, string>> = {
  fr: {training:'/formations/cryptographie-moderne/', openidTraining:'/formations/openid-cryptolab/', home:'/', expertise:'/expertises/', cases:'/realisations/', about:'/a-propos/', blog:'/blog/', contact:'/contact/', notice:'/legal/mentions-legales/', privacy:'/legal/confidentialite/', cookies:'/legal/cookies/', terms:'/legal/conditions/'},
  en: {training:'/en/training/modern-cryptography/', openidTraining:'/en/training/openid-cryptolab/', home:'/en/', expertise:'/en/expertise/', cases:'/en/work/', about:'/en/about/', blog:'/en/blog/', contact:'/en/contact/', notice:'/en/legal/notice/', privacy:'/en/legal/privacy/', cookies:'/en/legal/cookies/', terms:'/en/legal/terms/'},
};
export const href = (lang: Locale, key: Route) => paths[lang][key];
export const localeFromUrl = (url: URL): Locale => url.pathname.startsWith('/en/') ? 'en' : 'fr';
export const slugify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function alternate(path: string, lang: Locale) {
  const other: Locale = lang === 'fr' ? 'en' : 'fr';
  const normalized = path.endsWith('/') ? path : path + '/';
  for (const key of Object.keys(paths[lang]) as Route[]) if (normalized === paths[lang][key]) return paths[other][key];
  for (const key of ['blog', 'expertise', 'cases'] as Route[]) if (normalized.startsWith(paths[lang][key])) return paths[other][key] + normalized.slice(paths[lang][key].length);
  if (normalized.startsWith(lang === 'fr' ? '/categories/' : '/en/categories/')) return (other === 'fr' ? '/categories/' : '/en/categories/') + normalized.split('/categories/')[1];
  return paths[other].home;
}
export const categoriesHref = (lang: Locale, category?: string) => `${lang === 'en' ? '/en' : ''}/categories/${category ? slugify(category) + '/' : ''}`;
export const dateLabel = (date: Date, lang: Locale) => date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Paris'});
export const categoryLabel = (c: string, lang: Locale) => ({ identity: lang === 'fr' ? 'Identité numérique' : 'Digital identity', 'open-source': 'Open source', standards: lang === 'fr' ? 'Standards & protocoles' : 'Standards & protocols', training:lang==='fr'?'Formation & transmission':'Training & teaching' }[c] || c);

export const cyberInsuranceHref = (lang: Locale) => href(lang,'expertise') + 'expertise-cyber-assurance/';
export const walletExpertiseHref = (lang: Locale) => href(lang,'expertise') + 'wallets-identite-numerique/';
export const vdsVerifyHref = (lang: Locale) => href(lang,'expertise') + 'vds-verify/';
export const certificationAuditHref = (lang: Locale) => href(lang,'expertise') + 'audit/audits-certification/';
export const crisisExerciseHref = (lang: Locale) => href(lang,'expertise') + 'audit/exercices-crise-cyber/';
export type ExpertiseSection = 'conseil' | 'audit' | 'developpement';
export const expertiseSectionHref = (lang: Locale, section: ExpertiseSection) => href(lang,'expertise') + '#' + section;
export const formationHref = (lang: Locale) => href(lang,'training');

export const openidTrainingHref = (lang: Locale) => href(lang,'openidTraining');
export const externalLearning = {courseHome:'https://cours.stelau.com/',course:'https://cours.stelau.com/cours.html',oidapp:'https://le-du6.github.io/OIDApp/'} as const;
