import type {IconName} from './icons';
export type RebopLocale='fr'|'en';
const source={monitor:'https://www.rebop.io/real-time-certificate-monitoring/',probe:'https://docs.rebop.io/docs/guides/probe/what-is-probe/',imports:'https://docs.rebop.io/docs/guides/app/imports/',certificates:'https://docs.rebop.io/docs/guides/app/certificates/',engine:'https://docs.rebop.io/docs/guides/app/ai-engine/',advanced:'https://www.rebop.io/advanced-features/',settings:'https://docs.rebop.io/docs/guides/app/settings/',timeline:'https://docs.rebop.io/docs/guides/app/timeline/',site:'https://www.rebop.io/'};
type Card={icon:IconName;title:string;text:string;detail:string};
export const rebopContent:Record<RebopLocale,{
 title:string;description:string;lead:string;position:string;positionText:string;discovery:Card[];analysis:Card[];renewal:string[];operations:Card[];deployment:Card[];references:{label:string;url:string}[];
}>={
 fr:{
  title:'reBop — Un CLM au plus près des certificats.',
  description:'Le CLM pure player conçu par Stelau : découverte, analyse X.509, surveillance et détection des renouvellements, jusqu’au certificat réellement déployé.',
  lead:'Un certificat ne vit pas seul. Il a une autorité, des usages, des emplacements et une échéance. reBop relie ces informations pour rendre le cycle de vie observable, compréhensible et pilotable.',
  position:'Un CLM pure player. Une expertise PKI de terrain.',
  positionText:'reBop est un Certificate Lifecycle Management : son objet est le certificat, du repérage à son renouvellement observé. Une vision transversale des certificats, publics comme privés, au-delà d’une seule autorité de certification. Stelau y applique sa maîtrise de X.509, des infrastructures PKI et des contraintes d’exploitation.',
  discovery:[
   {icon:'globe',title:'Observer les services exposés.',text:'URL et port TCP, listes d’hôtes, export DNS ou recherche de sous-domaines : plusieurs points d’entrée permettent de retrouver les certificats présentés sur les services accessibles.',detail:'Les sources de découverte incluent les recherches DNS et les Certificate Transparency Logs. Un résultat de CT est un indice d’émission ; l’observation d’un service renseigne le certificat effectivement présenté.'},
   {icon:'satellite-dish',title:'Collecter dans les environnements internes.',text:'La sonde reBop parcourt les systèmes de fichiers locaux et les réseaux configurés pour découvrir les certificats qui ne sont pas exposés sur Internet.',detail:'La sonde open source fonctionne sous Windows, macOS, Linux et Unix. Elle produit un fichier JSON avec les certificats et leur contexte : chemin local, hôte et adresses IP. Les fichiers de clés privées sont ignorés.'},
   {icon:'layer-group',title:'Relier l’objet à ses emplacements.',text:'Un même certificat peut être utilisé sur plusieurs hôtes ou services. reBop conserve le contexte d’utilisation pour suivre les renouvellements emplacement par emplacement.',detail:'Import par fichier ou envoi de la sonde avec une clé d’API : la collecte alimente l’inventaire sans confondre le certificat avec le serveur qui l’utilise. La sonde mémorise les certificats déjà observés pour identifier les nouveautés.'},
  ],
  analysis:[
   {icon:'fingerprint',title:'Lire l’identité et les usages.',text:'Sujet, émetteur, numéro de série, période de validité, clé publique et extensions : l’encodage ASN.1 donne accès aux informations qui décrivent le certificat.',detail:'SAN, KeyUsage, ExtendedKeyUsage, BasicConstraints, politiques, AIA et points de distribution CRL : ces champs permettent de comprendre à quel usage et à quel environnement un certificat est destiné.'},
   {icon:'microscope',title:'Examiner le contexte de confiance.',text:'L’analyse détaillée de reBop réunit les informations du certificat, son état et les éléments de son contexte de confiance, avec une analyse de conformité.',detail:'La documentation produit décrit notamment l’inclusion dans les listes de confiance européennes eIDAS, Mozilla et Microsoft. La présence d’un certificat dans un inventaire ne suffit pas à établir sa confiance pour un usage donné.'},
   {icon:'binoculars',title:'Préparer l’agilité cryptographique.',text:'Identifier les algorithmes de signature, les clés et les usages permet de préparer les évolutions d’une politique cryptographique, y compris la transition post-quantique.',detail:'La première question est opérationnelle : où se trouvent les certificats concernés et quels services en dépendent ? L’inventaire et la lecture des paramètres rendent les dépendances visibles avant de planifier une migration.'},
  ],
  renewal:[
   'Une nouvelle observation révèle un certificat susceptible de remplacer un certificat déjà suivi.',
   'Le moteur de corrélation, appelé AI Engine dans reBop, identifie les renouvellements probables et traite les correspondances qu’il juge suffisamment certaines.',
   'Les cas incertains deviennent des propositions à accepter ou rejeter. Lors d’une acceptation, les labels et paramètres de suivi sont transmis au nouveau certificat ; l’ancien est archivé.',
   'L’observation continue des emplacements permet de repérer les certificats expirés, révoqués ou suspendus encore en ligne, et de suivre le délai entre le début de validité et le déploiement effectif.',
  ],
  operations:[
   {icon:'calendar-days',title:'Une échéance exploitable.',text:'La timeline répartit les certificats par échéance et par état de renouvellement. Les périodes deviennent des filtres vers les certificats à examiner.',detail:'Certificats renouvelés, renouvellements en attente et actions restantes : la vue de pilotage aide à préparer le travail plutôt qu’à réagir au dernier moment.'},
   {icon:'envelope',title:'Une alerte qui appelle une action.',text:'Alertes de validité, de révocation et de présence en ligne, notifications dans l’application, emails et rapports : les échéances se traduisent en informations pour les personnes concernées.',detail:'Les périodes et notifications sont configurables. Les alertes sont suivies par utilisateur et par organisation, avec les fonctions disponibles selon l’offre choisie.'},
   {icon:'tags',title:'Un contexte partagé.',text:'Labels, recherche et filtres organisent l’inventaire. Les profils opérateur et lecteur distinguent la gestion opérationnelle de la consultation.',detail:'Les journaux tracent les imports, les événements du cycle de vie, les modifications de labels et les décisions sur les propositions de renouvellement ; l’initiateur est enregistré lorsque pertinent.'},
  ],
  deployment:[
   {icon:'globe',title:'SaaS.',text:'Une plateforme hébergée pour fédérer la surveillance. Les sondes remontent les certificats des environnements internes selon le périmètre configuré.',detail:'Une même lecture des certificats exposés, internes et importés.'},
   {icon:'server',title:'Dans votre infrastructure.',text:'L’offre Enterprise prévoit une installation on-premise, en machine virtuelle ou en conteneur, ainsi qu’un déploiement dans votre IaaS.',detail:'Le mode de déploiement et les fonctions attendues se cadrent avec les équipes Stelau.'},
  ],
  references:[{label:'Découverte et surveillance',url:source.monitor},{label:'Sonde open source',url:source.probe},{label:'Analyse des certificats',url:source.certificates},{label:'AI Engine et renouvellements',url:source.engine},{label:'Deploy Delay et alertes',url:source.advanced},{label:'Timeline',url:source.timeline},{label:'Profils et journaux',url:source.settings},{label:'Offres et déploiement',url:source.site}],
 },
 en:{
  title:'reBop — A CLM built around certificates.',
  description:'Stelau’s pure-player CLM: discovery, X.509 analysis, monitoring and renewal detection, down to the certificate actually deployed.',
  lead:'A certificate never stands alone. It has an issuer, usages, locations and an expiry date. reBop connects that information to make its lifecycle observable, understandable and manageable.',
  position:'A pure-player CLM. Practical PKI expertise.',
  positionText:'reBop is a Certificate Lifecycle Management platform, focused on certificates from discovery to observed renewal. It provides a cross-cutting view of public and private certificates beyond any single certification authority. Stelau applies its expertise in X.509, PKI infrastructures and operational constraints to the product.',
  discovery:[
   {icon:'globe',title:'Observe exposed services.',text:'URLs and TCP ports, host lists, DNS exports or subdomain discovery provide several ways to locate certificates presented by accessible services.',detail:'Discovery sources include DNS searches and Certificate Transparency Logs. A CT result is evidence of issuance; observing a service reveals the certificate it actually presents.'},
   {icon:'satellite-dish',title:'Collect inside the infrastructure.',text:'The reBop probe scans local filesystems and configured networks to discover certificates that are not exposed to the Internet.',detail:'The open-source probe runs on Windows, macOS, Linux and Unix. It produces a JSON file containing certificates and their context: local paths, hosts and IP addresses. Private key files are ignored.'},
   {icon:'layer-group',title:'Connect certificates to locations.',text:'The same certificate may be used on multiple hosts or services. reBop retains its usage context to track renewals at each location.',detail:'File imports or probe uploads using an API key populate the inventory without confusing a certificate with the server using it. The probe remembers previously observed certificates to identify new ones.'},
  ],
  analysis:[
   {icon:'fingerprint',title:'Read identities and usages.',text:'Subject, issuer, serial number, validity period, public key and extensions: ASN.1 encoding provides access to the information describing a certificate.',detail:'SAN, KeyUsage, ExtendedKeyUsage, BasicConstraints, policies, AIA and CRL distribution points help explain the intended usage and environment of a certificate.'},
   {icon:'microscope',title:'Examine the trust context.',text:'reBop’s detailed analysis brings together certificate information, status and elements of its trust context, along with compliance analysis.',detail:'Product documentation covers inclusion in European eIDAS trusted lists, Mozilla and Microsoft. Adding a certificate to an inventory alone does not establish its trustworthiness for a particular use.'},
   {icon:'binoculars',title:'Prepare cryptographic agility.',text:'Identifying signature algorithms, keys and usages helps prepare changes to cryptographic policies, including the post-quantum transition.',detail:'The first question is operational: where are the affected certificates, and which services depend on them? Inventory and parameter inspection reveal dependencies before a migration is planned.'},
  ],
  renewal:[
   'A new observation reveals a certificate that may replace one already being monitored.',
   'The correlation engine, named AI Engine in reBop, identifies likely renewals and processes matches it considers sufficiently certain.',
   'Uncertain matches become proposals to accept or reject. Acceptance carries labels and monitoring settings over to the new certificate and archives the previous one.',
   'Continued observation of locations highlights expired, revoked or suspended certificates still online, and tracks the time between the start of validity and actual deployment.',
  ],
  operations:[
   {icon:'calendar-days',title:'An actionable timeline.',text:'The timeline groups certificates by expiry date and renewal status. Periods act as filters leading to the certificates requiring investigation.',detail:'Renewed certificates, pending renewals and remaining actions: the operational view helps teams prepare their work ahead of time.'},
   {icon:'envelope',title:'Alerts that prompt action.',text:'Validity, revocation and online-presence alerts, in-app notifications, emails and reports turn deadlines into information for the people concerned.',detail:'Periods and notifications are configurable. Alerts are tracked per user and organisation; available functions depend on the selected plan.'},
   {icon:'tags',title:'Shared operational context.',text:'Labels, search and filters organise the inventory. Operator and viewer profiles distinguish operational management from consultation.',detail:'Logs record imports, certificate lifecycle events, label changes and decisions on renewal proposals; the initiating user is recorded where relevant.'},
  ],
  deployment:[
   {icon:'globe',title:'SaaS.',text:'A hosted platform for centralised monitoring. Probes report certificates from internal environments within their configured scope.',detail:'One view of exposed, internal and imported certificates.'},
   {icon:'server',title:'In your infrastructure.',text:'The Enterprise offering supports on-premise installation, virtual machines or containers, as well as deployment in your own IaaS.',detail:'Deployment arrangements and required features are scoped with the Stelau team.'},
  ],
  references:[{label:'Discovery and monitoring',url:source.monitor},{label:'Open-source probe',url:source.probe},{label:'Certificate analysis',url:source.certificates},{label:'AI Engine and renewals',url:source.engine},{label:'Deploy Delay and alerts',url:source.advanced},{label:'Timeline',url:source.timeline},{label:'Profiles and logs',url:source.settings},{label:'Plans and deployment',url:source.site}],
 },
};
