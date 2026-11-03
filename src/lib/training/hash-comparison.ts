/** Compare equal-length hexadecimal digests, most significant bit first. */
export function compareHashBits(reference: string, current: string) {
 if (!reference || reference.length !== current.length || current.length % 2 !== 0 || !/^[a-f\d]+$/i.test(reference) || !/^[a-f\d]+$/i.test(current)) return null;
 const bits = Array.from(current, (digit, nibble) => {
  const before = parseInt(reference[nibble], 16), after = parseInt(digit, 16);
  return Array.from({length: 4}, (_, offset) => {
   const shift = 3 - offset;
   return {value: (after >> shift) & 1, changed: ((before ^ after) & (1 << shift)) !== 0};
  });
 }).flat();
 const changed = bits.filter(bit => bit.changed).length;
 const bytes = Array.from({length: current.length / 2}, (_, index) => ({
  hex: current.slice(index * 2, index * 2 + 2),
  changed: bits.slice(index * 8, index * 8 + 8).filter(bit => bit.changed).length,
 }));
 return {bits, bytes, changed, percent: changed / bits.length * 100};
}
