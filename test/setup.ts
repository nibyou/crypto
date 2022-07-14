import { Crypto, CryptoKey } from "@peculiar/webcrypto"

if (typeof global.crypto === 'undefined') { // noinspection JSConstantReassignment
  global.crypto = new Crypto()
}
if (typeof global.CryptoKey === 'undefined') global.CryptoKey = CryptoKey;