// Selected official SVGs from Stelau’s Font Awesome Kit. Paths are never reconstructed.
export const iconNames = ['binoculars', 'book-open', 'brackets-curly', 'briefcase', 'building', 'calendar-days', 'check', 'circle-half-stroke', 'circle-info', 'clapperboard', 'clipboard-check', 'clock', 'code', 'comments', 'compass', 'database', 'envelope', 'eye', 'file-check', 'file-signature', 'fingerprint', 'flask-vial', 'globe', 'graduation-cap', 'headphones', 'id-card', 'images', 'layer-group', 'lightbulb-on', 'link', 'list', 'location-dot', 'magnifying-glass', 'microchip', 'microscope', 'mug-hot', 'paper-plane', 'passport', 'pen-nib', 'phone', 'puzzle-piece', 'question', 'route', 'satellite-dish', 'scale-balanced', 'seedling', 'server', 'share-nodes', 'shish-kebab', 'sliders', 'tags', 'users', 'wallet', 'xmark'] as const;
export type IconName = typeof iconNames[number];

export const expertiseIcons: Record<string,IconName> = {conseil:'lightbulb-on',audit:'microscope',developpement:'brackets-curly'};
export const caseIcons: Record<string,IconName> = {'services-de-confiance':'file-signature','france-identite':'fingerprint',idfod:'passport','mdl-mdoc':'wallet','nested-vds':'file-check'};
