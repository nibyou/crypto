# @nibyou/crypto

Nibyou's crypto package is a wrapper around the WebCrypto and specifically the SubtleCrypto APIs. This package proides easily reusable functions around the cryptography used by Nibyou.

For client support, see [caniuse](https://caniuse.com/?search=crypto).

## Usage

Install the package using `npm` or `yarn`.

Import the crypto functions:

```javascript
import * as ncrypto from '@nibyou/crypto';
```

### Asymmetric encryption

This library uses RSA-OAEP with SHA-256 and 4096 bit keylength in accordance with the current [recommendations by the BSI](https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/TechGuidelines/TG02102/BSI-TR-02102-1.pdf?__blob=publicationFile).

Keys are exchanged headless, so the differenciation between public and private keys has to be made in the business logic.

#### Key handling

Generate a new RSA Key Pair:

```typescript
const keyPairAlice: CryptoKeyPair = await ncrypto.generateKeyPair();
```

Export the Public and Private key into Base64 (SPKI and PKCS #8 respectively):

```typescript
const spki: string = await ncrypto.exportPublicKey(keyPairAlice.publicKey);
const pkcs8: string = await ncrypto.exportPrivateKey(keyPairAlice.privateKey);
```

Import Public and Private keys into CryptoKey objects again:

```typescript
const publicKey: CryptoKey = await ncrypto.importPublicKey(spki);
const privateKey: CryptoKey = await ncrypto.importPrivateKey(pkcs8);
```

#### Encryption

To encrypt a message you need another public key, lets call this one `keyPairBob`.

```typescript
const keyPairBob: CryptoKeyPair = await ncrypto.generateKeyPair();
```

A message can either be a string or an object, during encryption, objects will be converted into JSON strings.

```typescript
const message = 'Guten Tag, Bob!';
```

The encryption function `encryptRSA` expects the data (in this case `message`) and a public key (in this case `keyPairBob.publicKey`).

```typescript
const cipherText = await ncrypto.encryptRSA(message, keyPairBob.publicKey);
```

The resulting value will be an `RSAEncryptionResult` object containing the cipher text in its `data` property. 

```typescript
console.log(cipherText.data); // => 'aenc:AKV9xVMHFSCa2yIwOjCwvpP1UkSbLaqqMu49Tg2CWDXk9xsi5MiArQwmJrrfdKqyfJ3Fag7/9AS+TX4RnHqIxKX26WKgH7EKwdnRTjB9X/PbKOOfNLmq4T/K2CSr+y9n1iJbIOyQpvfnCOFIaIwmQ8CKVTKyrcGcOF8GBdJpujlqSENaD3Q16B4yW4G5M6kSnImnRebHtqhayRk5o84Omj6l4wXGyhqoT/yxD7wlet1nSuZTqU2U3JTfOvoFjYferHPTnEpo38uUWq09fbOoEI3vNBn/UiPN7MoA7uWufNOECvtDxuJty6frbTwvmzj9ZHfwdhy55x21MLXzctJUbw=='
```

All data encrypted with `encryptRSA` starts with the `aenc` prefix.

#### Decryption

To decrypt the previous message, you need Bob's private key. 

Similar to the encryption function, `decryptRSA` expects the data (in this case `cipherText.data`) and the corresponding private key (in this case `keyPairBob.privateKey`).

```typescript
const secretMessage = await ncrypto.decryptRSA(cipherText.data, keyPairBob.privateKey);
console.log(secretMessage); // => 'Guten Tag, Bob!';
```

### Symmetric encryption

@nibyou/crypto supports AES-GCM-256 with random, 96 bit initialization vectors. 

#### Key handling

Generate a new AES key:

```typescript
const key: CryptoKey = await ncrypto.generateKey();
```

Export the key into raw Base64 format:

```typescript
const raw: string = await ncrypto.exportKey(key);
```

Import raw format keys into CryptoKeys

```typescript
const reImport: CryptoKey = await ncrypto.importKey(raw);
```

#### Encryption

You can use the generated key to encrypt data the same way it's done with RSA:

```typescript
const encrypted = await ncrypto.encryptAES("Hallo, wie geht's denn so?", key);
console.log(encrypted.data); // => 'senc:26AsDbeclttMdQUHTXumWrTrg3ZEb+en0qU=.pUE96B4D8mhYetFP'
```

Notice the format: the data is prefixed with `senc`, and contains the ciphertext and initialization vector, joined with a dot. 

#### Decryption

The same key can then decrypt the encrypted message:

```typescript
const decrypted: string = await ncrypto.decryptAES(encrypted, key);
console.log(decrypted); // => 'Hallo, wie geht's denn so?'
```

### Key derivation

Lastly, this package also supports deriving PBKDF2 keys from strings with 64 bit salts:

```typescript
const randomUserInput = 'ThisIsASuperSecurePassword';
const derivedKey: CryptoKey = await ncrypto.deriveKey(randomUserInput);
```

The key can then be used in other AES operations.

## Testing

To test this library, you can run the tests with `npm test` or `yarn test`.

## License

This library is licensed under the GPL Version 3 license. See [LICENSE](./LICENSE).