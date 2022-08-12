import { Crypto, CryptoKey } from "@peculiar/webcrypto"

if (typeof global.crypto === 'undefined') { // noinspection JSConstantReassignment
  global.crypto = new Crypto()
}
if (typeof global.CryptoKey === 'undefined') global.CryptoKey = CryptoKey;

if (typeof global.crypto.getRandomValues === 'undefined') { // noinspection JSConstantReassignment
  global.crypto.getRandomValues = require('node:crypto').webcrypto.getRandomValues;
}