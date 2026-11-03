// AES-128 pas à pas, pour les planches : chiffrement complet et trace des états intermédiaires
// (SubBytes, ShiftRows, MixColumns, AddRoundKey). Vérifié dans tests/aes.test.js contre FIPS-197
// (annexes B et C.1). Pédagogique : ni rapide, ni à temps constant — ne pas l'utiliser pour chiffrer.

// --- S-box (calculée : inverse dans GF(2^8) puis transformation affine)
const mul = (a, b) => {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hi = a & 0x80;
    a = (a << 1) & 0xff;
    if (hi) a ^= 0x1b;
    b >>= 1;
  }
  return p;
};
export const SBOX = (() => {
  const s = new Uint8Array(256);
  for (let x = 0; x < 256; x++) {
    let inv = 0;
    if (x) for (inv = 1; mul(x, inv) !== 1; inv++);
    let y = inv;
    for (let k = 1; k <= 4; k++) y ^= ((inv << k) | (inv >> (8 - k))) & 0xff;
    s[x] = y ^ 0x63;
  }
  return s;
})();

// L'état est un tableau de 16 octets dans l'ordre de FIPS-197 : colonne par colonne
// (s[r + 4c] = ligne r, colonne c).
export const subBytes = (s) => s.map((v) => SBOX[v]);
export const shiftRows = (s) => s.map((_, i) => s[(i % 4) + 4 * (((i >> 2) + (i % 4)) % 4)]);
export const mixColumns = (s) => {
  const o = new Uint8Array(16);
  for (let c = 0; c < 4; c++) {
    const [a0, a1, a2, a3] = s.slice(4 * c, 4 * c + 4);
    o[4 * c] = mul(a0, 2) ^ mul(a1, 3) ^ a2 ^ a3;
    o[4 * c + 1] = a0 ^ mul(a1, 2) ^ mul(a2, 3) ^ a3;
    o[4 * c + 2] = a0 ^ a1 ^ mul(a2, 2) ^ mul(a3, 3);
    o[4 * c + 3] = mul(a0, 3) ^ a1 ^ a2 ^ mul(a3, 2);
  }
  return o;
};
export const addRoundKey = (s, k) => s.map((v, i) => v ^ k[i]);

/** Clés de tour (11 × 16 octets) d'une clé AES-128. */
export function expandKey(key) {
  const w = [...key];
  let rcon = 1;
  for (let i = 16; i < 176; i += 4) {
    let t = w.slice(i - 4, i);
    if (i % 16 === 0) {
      t = [SBOX[t[1]] ^ rcon, SBOX[t[2]], SBOX[t[3]], SBOX[t[0]]];
      rcon = mul(rcon, 2);
    }
    for (let j = 0; j < 4; j++) w.push(w[i - 16 + j] ^ t[j]);
  }
  return Array.from({ length: 11 }, (_, r) => Uint8Array.from(w.slice(16 * r, 16 * r + 16)));
}

/**
 * Chiffre un bloc et renvoie la trace : [{ round, step, state }], step ∈ input, addRoundKey,
 * subBytes, shiftRows, mixColumns ; le dernier état est le chiffré.
 */
export function encryptTrace(plain, key) {
  const ks = expandKey(key);
  const trace = [];
  let s = Uint8Array.from(plain);
  trace.push({ round: 0, step: "input", state: s });
  s = addRoundKey(s, ks[0]);
  trace.push({ round: 0, step: "addRoundKey", state: s });
  for (let r = 1; r <= 10; r++) {
    s = subBytes(s);
    trace.push({ round: r, step: "subBytes", state: s });
    s = shiftRows(s);
    trace.push({ round: r, step: "shiftRows", state: s });
    if (r < 10) {
      s = mixColumns(s);
      trace.push({ round: r, step: "mixColumns", state: s });
    }
    s = addRoundKey(s, ks[r]);
    trace.push({ round: r, step: "addRoundKey", state: s });
  }
  return trace;
}
export const encrypt = (plain, key) => encryptTrace(plain, key).at(-1).state;
export const fromHex = (h) => Uint8Array.from(h.match(/../g), (x) => parseInt(x, 16));
