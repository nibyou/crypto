import {
  decryptRSA,
  encryptRSA,
  generateKeyPair
} from '../dist';

const plaintext = 'Hello World';
const plainObject = {
    hello: 'world',
}

describe("RSA Encryption", () => {
    test("Encrypt text", async () => {
        const keyPair = await generateKeyPair(true);
        const encrypted = await encryptRSA(plaintext, keyPair.publicKey);
        expect(typeof encrypted.data).toBe("string");
    });
    test("Encrypt object", async () => {
        const keyPair = await generateKeyPair(true);
        const encrypted = await encryptRSA(plainObject, keyPair.publicKey);
        expect(typeof encrypted.data).toBe("string");
    });
});

describe("RSA Decryption", () => {
    test("Decrypt text", async () => {
        const keyPair = await generateKeyPair(true);
        const encrypted = await encryptRSA(plaintext, keyPair.publicKey);
        const decrypted = await decryptRSA(encrypted.data, keyPair.privateKey);
        expect(decrypted).toBe(plaintext);
    });
    test("Decrypt object", async () => {
        const keyPair = await generateKeyPair(true);
        const encrypted = await encryptRSA(plainObject, keyPair.publicKey);
        const decrypted = await decryptRSA(encrypted.data, keyPair.privateKey);
        expect(decrypted.hello).toBe(plainObject.hello);
    });
});