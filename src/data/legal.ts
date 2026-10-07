import { companyContact } from './company';

export const legalDocuments = {
  "notice": {
    "fr": {
      "title": "Mentions légales",
      "description": "Informations sur l’éditeur, l’hébergement et les contenus du site Stelau.",
      "sections": [
        [
          "editeur",
          "Éditeur du site",
          `Le site est édité par Stelau SAS. Implantations : ${companyContact.locationsLabel}. Les directeurs de publication sont Benoit Leger-Derville et Nicolas Chalanset. Contact : contact@stelau.com.`
        ],
        [
          "hebergement",
          "Hébergement",
          "Cette version de préproduction est consultable localement. Les coordonnées de l’hébergeur définitif seront renseignées avant sa mise en ligne."
        ],
        [
          "contenus",
          "Contenus et photographies",
          "Les textes, publications, marques et éléments graphiques sont présentés sous réserve des droits de leurs titulaires. Les photographies proviennent de l’équipe Stelau et des ressources Freepik fournies pour ce projet. Les articles techniques conservent leurs auteurs et leurs liens vers les projets cités."
        ],
        [
          "contact",
          "Nous contacter",
          `Pour une question sur ce site ou ses contenus, écrivez à contact@stelau.com ou appelez le ${companyContact.phoneLabel}.`
        ]
      ]
    },
    "en": {
      "title": "Legal notice",
      "description": "Information about the publisher, hosting and contents of the Stelau website.",
      "sections": [
        [
          "publisher",
          "Website publisher",
          `This website is published by Stelau SAS. Locations: ${companyContact.locationsLabel}. Publication directors: Benoit Leger-Derville and Nicolas Chalanset. Contact: contact@stelau.com.`
        ],
        [
          "hosting",
          "Hosting",
          "This preproduction version is available locally. The final hosting provider’s details will be included before publication."
        ],
        [
          "content",
          "Content and photographs",
          "Texts, publications, trademarks and graphics are presented subject to their respective owners’ rights. Photographs come from the Stelau team and the Freepik resources provided for this project. Technical articles retain their authors and links to the referenced projects."
        ],
        [
          "contact",
          "Contact",
          `For questions about this website or its contents, email contact@stelau.com or call ${companyContact.phoneLabel}.`
        ]
      ]
    }
  },
  "privacy": {
    "fr": {
      "title": "Confidentialité",
      "description": "Les informations liées à votre demande de contact sur le site Stelau.",
      "sections": [
        [
          "responsable",
          "Responsable du traitement",
          `Stelau SAS est votre interlocuteur pour les demandes envoyées depuis ce site. Implantations : ${companyContact.locationsLabel}. Vous pouvez nous écrire à contact@stelau.com.`
        ],
        [
          "donnees",
          "Informations du formulaire",
          "Le formulaire demande votre prénom, votre nom, votre email et le message que vous souhaitez nous adresser. Le nom de votre organisation est facultatif. Ces informations nous permettent de comprendre votre demande et d’y répondre."
        ],
        [
          "destinataires",
          "Envoi et destinataires",
          "Le formulaire utilise le service Formspree déjà présent sur le site Stelau actuel. Lorsque vous envoyez le formulaire, les informations sont transmises à ce service pour être acheminées vers Stelau. Vous pouvez également nous contacter directement par email ou téléphone."
        ],
        [
          "droits",
          "Vos droits et vos questions",
          "Vous pouvez contacter Stelau à contact@stelau.com pour toute demande relative à vos données ou à l’exercice de vos droits. Les durées de conservation, la base juridique et les modalités du prestataire seront précisées et validées avant publication."
        ],
        [
          "preferences",
          "Préférences de navigation",
          "Le site conserve votre choix de thème dans votre navigateur. La recherche s’exécute dans votre navigateur à partir d’un index du site. Cette version ne charge aucun outil de publicité ou de mesure d’audience."
        ]
      ]
    },
    "en": {
      "title": "Privacy",
      "description": "Information about enquiries sent through the Stelau website.",
      "sections": [
        [
          "controller",
          "Data controller",
          `Stelau SAS is your contact for enquiries sent from this website. Locations: ${companyContact.locationsLabel}. You can email contact@stelau.com.`
        ],
        [
          "data",
          "Contact form information",
          "The form asks for your first name, last name, email address and message. Your organisation’s name is optional. We use this information to understand and respond to your enquiry."
        ],
        [
          "recipients",
          "Sending and recipients",
          "The form uses Formspree, the service already used by the current Stelau website. Submitting the form sends the information to that service for delivery to Stelau. You may also contact us directly by email or telephone."
        ],
        [
          "rights",
          "Your rights and questions",
          "Contact Stelau at contact@stelau.com for requests about your data or the exercise of your rights. Retention periods, the legal basis and provider arrangements will be specified and validated before publication."
        ],
        [
          "preferences",
          "Browsing preferences",
          "The website stores your theme preference in your browser. Search runs in your browser using the website’s index. This version does not load advertising or analytics services."
        ]
      ]
    }
  },
  "cookies": {
    "fr": {
      "title": "Cookies et préférences",
      "description": "Le fonctionnement des préférences de navigation sur le site Stelau.",
      "sections": [
        [
          "theme",
          "Votre choix de thème",
          "Votre choix Système, Clair ou Sombre est conservé dans le stockage local de votre navigateur sous la clé stelau-theme. Il sert uniquement à retrouver la présentation que vous avez choisie."
        ],
        [
          "gestion",
          "Modifier ou supprimer ce choix",
          "Vous pouvez changer le thème à tout moment dans la navigation du site. Vous pouvez aussi supprimer les données du site dans les réglages de votre navigateur. Si aucun choix n’est enregistré, le site suit le thème de votre système."
        ],
        [
          "services",
          "Services et liens externes",
          "Les liens vers LinkedIn, GitHub, FullVerify et la carte vous conduisent sur des services externes. Leur utilisation relève des informations et préférences propres à ces services. Le formulaire de contact utilise Formspree au moment de l’envoi."
        ],
        [
          "mesure",
          "Mesure d’audience",
          "Cette version du site ne charge aucun outil de mesure d’audience ou de publicité. Tout ajout futur devra être accompagné des informations et réglages appropriés."
        ]
      ]
    },
    "en": {
      "title": "Cookies and preferences",
      "description": "How browsing preferences work on the Stelau website.",
      "sections": [
        [
          "theme",
          "Your theme preference",
          "Your System, Light or Dark preference is saved in your browser’s local storage under the stelau-theme key. Its only purpose is to restore the presentation you chose."
        ],
        [
          "control",
          "Changing or removing your choice",
          "You can change the theme at any time using the website navigation. You can also remove the website’s stored data in your browser settings. If no choice is saved, the website follows your system’s theme."
        ],
        [
          "services",
          "External services and links",
          "Links to LinkedIn, GitHub, FullVerify and the map take you to external services. Their use is subject to those services’ own information and preferences. The contact form uses Formspree when submitted."
        ],
        [
          "analytics",
          "Analytics",
          "This version does not load analytics or advertising services. Any future addition will need appropriate information and controls."
        ]
      ]
    }
  },
  "terms": {
    "fr": {
      "title": "Conditions d’utilisation",
      "description": "Les conditions de consultation du site vitrine et du Blog Stelau.",
      "sections": [
        [
          "objet",
          "Objet du site",
          "Ce site présente les activités de conseil, d’audit et de développement de Stelau, son équipe et ses publications techniques. L’envoi d’une demande de contact ne constitue pas une commande de prestation. Les conditions d’une mission sont définies dans les documents contractuels convenus avec le client."
        ],
        [
          "publications",
          "Publications techniques",
          "Les articles décrivent des travaux et des implémentations à leur date de publication. Les standards, bibliothèques et contextes peuvent évoluer. Les extraits de code sont accompagnés de références aux projets concernés, dont les licences propres restent applicables."
        ],
        [
          "liens",
          "Liens externes",
          "Les liens externes donnent accès aux ressources citées et aux projets associés. Ces services disposent de leurs propres conditions d’utilisation."
        ],
        [
          "contact",
          "Signaler une erreur",
          "Si vous constatez une erreur ou souhaitez poser une question sur une publication, contactez-nous à contact@stelau.com."
        ]
      ]
    },
    "en": {
      "title": "Terms of use",
      "description": "Terms for browsing the Stelau website and journal.",
      "sections": [
        [
          "purpose",
          "Website purpose",
          "This website presents Stelau’s consulting, audit and development activities, its team and technical publications. Sending an enquiry does not constitute an order for services. Engagement terms are defined in the contractual documents agreed with the client."
        ],
        [
          "publications",
          "Technical publications",
          "Articles describe work and implementations as of their publication date. Standards, libraries and contexts may evolve. Code excerpts refer to the relevant projects, whose own licences remain applicable."
        ],
        [
          "links",
          "External links",
          "External links provide access to referenced resources and related projects. These services have their own terms of use."
        ],
        [
          "contact",
          "Reporting an error",
          "If you find an error or have a question about a publication, contact contact@stelau.com."
        ]
      ]
    }
  }
};
