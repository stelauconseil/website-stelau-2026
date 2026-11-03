import {externalLearning} from '@/config/site';
export const scenes = {
  primitives: {steps:0, anchor:'primitives-animation', fr:'Les cinq primitives en action', en:'The five primitives in action'},
  certificate: {steps:5, anchor:'assemblage-certificat', fr:'Construire un certificat', en:'Assembling a certificate'},
  tls: {steps:4, anchor:'assemblage-tls', fr:'Lire un assemblage TLS', en:'Reading a TLS assembly'},
  aes: {steps:6, anchor:'histoire-aes-confusion-diffusion', fr:'Voir un tour d’AES', en:'Watching an AES round'},
  totp: {steps:3, anchor:'hachage-totp/2', fr:'Du secret au code TOTP', en:'From a secret to a TOTP code'},
} as const;
export type SceneId = keyof typeof scenes;
export const sceneIds = Object.keys(scenes) as SceneId[];
export const courseUrl = (id:SceneId) => externalLearning.course+'#/'+scenes[id].anchor;
