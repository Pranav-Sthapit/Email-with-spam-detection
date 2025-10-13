// Convert character to number (ASCII) and back
const charToNumber = (char) => BigInt(char.charCodeAt(0));
const numberToChar = (num) => String.fromCharCode(Number(num));

// Greatest common divisor
const gcd = (a, b) => {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
};

// Trial-and-error modular inverse (works for small numbers)
const simpleModInverse = (e, phi) => {
  for (let d = 1n; d < phi; d++) {
    if ((e * d) % phi === 1n) return d;
  }
  return -1n;
};

// Modular exponentiation
const modPow = (base, exp, mod) => {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return result;
};

// Check prime
const isPrime = (n) => {
  if (n < 2n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false;
  for (let i = 3n; i * i <= n; i += 2n) {
    if (n % i === 0n) return false;
  }
  return true;
};

// Next prime
const nextPrime = (n) => {
  if (n % 2n === 0n) n++;
  while (!isPrime(n)) n += 2n;
  return n;
};

// Generate prime from email (≥ lowerBound)
const randomPrime = (mailAddress, lowerBound) => {
  let num = BigInt(
    [...mailAddress]
      .map((c) => c.charCodeAt(0))
      .reduce((a, b) => a * 256 + b, 0)
  );
  let candidate = lowerBound + (num % 1000n);
  if (candidate < lowerBound) candidate = lowerBound;
  while (!isPrime(candidate)) candidate++;
  return candidate;
};

// Generate RSA keys
export const getKeys = (mailAddress) => {
  const lowerBound = 256n; // max char code
  const P = nextPrime(randomPrime(mailAddress, lowerBound));
  const Q = nextPrime(P + 1n); // ensure P != Q
  const N = P * Q;
  const phi = (P - 1n) * (Q - 1n);

  // Choose public key e
  let e = 3n;
  while (gcd(e, phi) !== 1n) e += 2n;

  const d = simpleModInverse(e, phi); // trial-and-error
  return { publicKey: e, privateKey: d, N };
};

// Encrypt message character by character
export const encryptString = (str, publicKey, N) => {
  return [...str].map((c) => modPow(charToNumber(c), publicKey, N));
};

// Decrypt message character by character
export const decryptString = (encryptedArray, privateKey, N) => {
  return encryptedArray
    .map((num) => numberToChar(modPow(num, privateKey, N)))
    .join("");
};

/*/ --- Test ---
const message = "I am pranav Sthapit and i am going to make rsa";
const keys = getKeys("pranav@example.com");

const encrypted = encryptString(message, keys.publicKey, keys.N);
const decrypted = decryptString(encrypted, keys.privateKey, keys.N);

console.log(keys.publicKey, keys.privateKey);
console.log("Encrypted array:", encrypted);
console.log("Decrypted text:", decrypted);*/
