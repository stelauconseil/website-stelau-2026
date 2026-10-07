// Selected official SVGs from Stelau’s Font Awesome Kit. Paths are never reconstructed.
export const iconNames = ['users','compass','magnifying-glass','code','comments','briefcase','book-open','share-nodes','link','clipboard-check','eye','file-check','check','xmark','question','scale-balanced','wallet','id-card','microchip','location-dot','envelope','phone','paper-plane','calendar-days','clock','tags','list','sliders','building','server','images','database','globe','circle-half-stroke','circle-info'] as const;
export type IconName = typeof iconNames[number];

export const expertiseIcons: Record<string,IconName> = {conseil:'compass',audit:'magnifying-glass',developpement:'code'};
export const caseIcons: Record<string,IconName> = {'services-de-confiance':'scale-balanced','france-identite':'id-card',idfod:'microchip','mdl-mdoc':'wallet','nested-vds':'file-check'};
