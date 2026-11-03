// SHA-1, SHA-256, HMAC et HOTP / TOTP synchrones, pour les planches de hachage.
// Calculs exacts (vérifiés dans tests/hash.test.js contre FIPS 180-4, RFC 2202, RFC 4226 et
// RFC 6238) ; synchrones pour pouvoir en enchaîner des milliers par image (preuve de travail).
// WebCrypto reste préférable pour les calculs lourds (PBKDF2).

const enc = new TextEncoder();
/** Texte (UTF-8), tableau d'octets ou ArrayBuffer → Uint8Array. */
export const bytes = (x) =>
  typeof x === "string" ? enc.encode(x) : x instanceof Uint8Array ? x : new Uint8Array(x);
export const toHex = (b) => Array.from(b, (v) => v.toString(16).padStart(2, "0")).join("");
export const toBits = (b) => Array.from(b, (v) => v.toString(2).padStart(8, "0")).join("");
/** Nombre de bits à 0 en tête d'une empreinte. */
export const leadingZeroBits = (b) => {
  let n = 0;
  for (const v of b) {
    if (v === 0) {
      n += 8;
      continue;
    }
    return n + Math.clz32(v) - 24;
  }
  return n;
};
/** Nombre de bits différents entre deux empreintes de même taille (effet avalanche). */
export const bitDiff = (a, b) => {
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    let x = a[i] ^ b[i];
    while (x) {
      n += x & 1;
      x >>>= 1;
    }
  }
  return n;
};

// Bourrage commun à SHA-1 et SHA-256 : 0x80, des zéros, la longueur en bits sur 64 bits (big-endian).
function pad(msg) {
  const len = msg.length;
  const total = (((len + 8) >> 6) + 1) << 6;
  const out = new Uint8Array(total);
  out.set(msg);
  out[len] = 0x80;
  const dv = new DataView(out.buffer);
  dv.setUint32(total - 8, Math.floor((len * 8) / 2 ** 32));
  dv.setUint32(total - 4, (len * 8) >>> 0);
  return dv;
}
const rotl = (x, n) => (x << n) | (x >>> (32 - n));
const rotr = (x, n) => (x >>> n) | (x << (32 - n));

export function sha1(input) {
  const dv = pad(bytes(input));
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Int32Array(80);
  for (let o = 0; o < dv.byteLength; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getInt32(o + i * 4);
    for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    let [a, b, c, d, e] = h;
    for (let i = 0; i < 80; i++) {
      const f =
        i < 20
          ? ((b & c) | (~b & d)) + 0x5a827999
          : i < 40
            ? (b ^ c ^ d) + 0x6ed9eba1
            : i < 60
              ? ((b & c) | (b & d) | (c & d)) + 0x8f1bbcdc
              : (b ^ c ^ d) + 0xca62c1d6;
      const t = (rotl(a, 5) + f + e + w[i]) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = t;
    }
    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0;
  }
  const out = new DataView(new ArrayBuffer(20));
  h.forEach((v, i) => out.setInt32(i * 4, v));
  return new Uint8Array(out.buffer);
}

const K256 = new Int32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export function sha256(input) {
  const dv = pad(bytes(input));
  const h = new Int32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const w = new Int32Array(64);
  for (let o = 0; o < dv.byteLength; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getInt32(o + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 =
        (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K256[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((v, i) => (h[i] = (h[i] + v) | 0));
  }
  const out = new DataView(new ArrayBuffer(32));
  h.forEach((v, i) => out.setInt32(i * 4, v));
  return new Uint8Array(out.buffer);
}

/** HMAC (RFC 2104) : H((K ⊕ opad) ‖ H((K ⊕ ipad) ‖ m)), bloc de 64 octets. */
export function hmac(hash, key, msg) {
  let k = bytes(key);
  if (k.length > 64) k = hash(k);
  const ipad = new Uint8Array(64).fill(0x36);
  const opad = new Uint8Array(64).fill(0x5c);
  k.forEach((v, i) => {
    ipad[i] ^= v;
    opad[i] ^= v;
  });
  const m = bytes(msg);
  const inner = new Uint8Array(64 + m.length);
  inner.set(ipad);
  inner.set(m, 64);
  const ih = hash(inner);
  const outer = new Uint8Array(64 + ih.length);
  outer.set(opad);
  outer.set(ih, 64);
  return hash(outer);
}

/** Compteur sur 8 octets big-endian (RFC 4226). */
export function counterBytes(c) {
  const b = new Uint8Array(8);
  new DataView(b.buffer).setUint32(0, Math.floor(c / 2 ** 32));
  new DataView(b.buffer).setUint32(4, c >>> 0);
  return b;
}

/**
 * HOTP (RFC 4226) avec le détail de la troncature dynamique, pour l'afficher pas à pas :
 * mac (20 octets), offset (4 bits de poids faible du dernier octet), les 4 octets retenus,
 * le nombre sur 31 bits, puis le code à `digits` chiffres.
 */
export function hotp(key, counter, digits = 6) {
  const mac = hmac(sha1, key, counterBytes(counter));
  const offset = mac[mac.length - 1] & 0x0f;
  const slice = mac.slice(offset, offset + 4);
  const bin = ((slice[0] & 0x7f) << 24) | (slice[1] << 16) | (slice[2] << 8) | slice[3];
  const code = String(bin % 10 ** digits).padStart(digits, "0");
  return { mac, offset, slice, bin, code };
}

/** TOTP (RFC 6238) : HOTP sur T = ⌊t / pas⌋, t en secondes Unix. */
export function totp(key, t = Date.now() / 1000, { step = 30, digits = 6 } = {}) {
  const T = Math.floor(t / step);
  return { T, remaining: step - (t % step), ...hotp(key, T, digits) };
}

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
/** Base32 (RFC 4648) sans bourrage : le format des secrets TOTP (otpauth://). */
export function base32(input) {
  let bits = 0,
    val = 0,
    out = "";
  for (const v of bytes(input)) {
    val = (val << 8) | v;
    bits += 8;
    while (bits >= 5) {
      out += B32[(val >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}
