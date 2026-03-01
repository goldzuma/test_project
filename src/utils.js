/**
 * Version 1: Brute-force O(n³)
 *
 * Advantages:
 *   - Simple and easy to reason about
 *   - No extra memory beyond the result array
 *
 * Disadvantages:
 *   - O(n³) time — slow for large arrays
 */
export const detectSums = (array) => {
  if (!Array.isArray(array)) {
    throw new Error('Input is not an array');
  }

  const results = [];
  const n = array.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let s = 0; s < n; s++) {
        if (s !== i && s !== j && array[i] + array[j] === array[s]) {
          results.push({ pA: i, pB: j, sum: s });
        }
      }
    }
  }
  console.log(results)

  return results;
};

/**
 * Version 2: Map-based O(n²) average-case
 *
 * Advantages:
 *   - O(n²) time on average — much faster for large arrays with many distinct values
 *
 * Disadvantages:
 *   - O(n) extra space for the value→indices map
 *   - Worst-case time is still O(n³) when all values are identical (e.g. [0,0,0,...])
 *     because every pair maps to O(n) candidate sum indices
 */
export const detectSumsOptimized = (array) => {
  if (!Array.isArray(array)) {
    throw new Error('Input is not an array');
  }

  const valueMap = new Map();
  array.forEach((val, idx) => {
    if (!valueMap.has(val)) valueMap.set(val, []);
    valueMap.get(val).push(idx);
  });

  const results = [];
  const n = array.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const target = array[i] + array[j];
      for (const s of (valueMap.get(target) || [])) {
        if (s !== i && s !== j) {
          results.push({ pA: i, pB: j, sum: s });
        }
      }
    }
  }

  return results;
};

export function calculateResult(input) {
  const parsedInput = input.split(',').map(i => parseInt(i.trim(), 10));
  let error = null;
  let result = '';
  try {
    result = detectSums(parsedInput);
  } catch (e) {
    error = e.message;
  }
  return { input: parsedInput, result, error }
}
