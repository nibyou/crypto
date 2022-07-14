import {
  deriveKey,
  generateKeyPair,
  exportPrivateKey,
  exportPublicKey,
  importPublicKey,
  importPrivateKey,
  generateKey,
  exportKey,
  importKey
} from '../dist';
import { arrayBufferToBase64 } from '../dist/lib/utils';

describe("Key Derivation", () => {
  test("Two derived Keys with random salt are not equal", async () => {
    const password = "password";
    const iterations = 100;
    const key1 : CryptoKey = await deriveKey(password, iterations);
    const key2 : CryptoKey = await deriveKey(password, iterations);
    const key1b64 = arrayBufferToBase64(await crypto.subtle.exportKey("raw", key1));
    const key2b64 = arrayBufferToBase64(await crypto.subtle.exportKey("raw", key2));
    expect(key1).toBeInstanceOf(CryptoKey);
    expect(key2).toBeInstanceOf(CryptoKey);
    expect(key1b64).not.toBe(key2b64);
  });

  test("Two derived Keys with set salt are equal", async () => {
    const password = "password";
    const salt = "salt";
    const iterations = 100;
    const key1 : CryptoKey = await deriveKey(password, iterations, salt);
    const key2 : CryptoKey = await deriveKey(password, iterations, salt);
    const key1b64 = arrayBufferToBase64(await crypto.subtle.exportKey("raw", key1));
    const key2b64 = arrayBufferToBase64(await crypto.subtle.exportKey("raw", key2));
    expect(key1).toBeInstanceOf(CryptoKey);
    expect(key2).toBeInstanceOf(CryptoKey);
    expect(key1b64).toBe(key2b64);
  });
});

describe("RSA Keys", () => {
  test("Generate Key Pair returns two CryptoKeys", async () => {
    const keyPair = await generateKeyPair();
    expect(keyPair.publicKey).toBeInstanceOf(CryptoKey);
    expect(keyPair.privateKey).toBeInstanceOf(CryptoKey);
  });

  test("Generate Key Pair returns two CryptoKeys with extractable = true", async () => {
    const keyPair = await generateKeyPair(true);
    expect(keyPair.publicKey).toBeInstanceOf(CryptoKey);
    expect(keyPair.privateKey).toBeInstanceOf(CryptoKey);
    expect(keyPair.publicKey.extractable).toBe(true);
    expect(keyPair.privateKey.extractable).toBe(true);
  });

  test("Export Public Key returns a string", async () => {
    const keyPair = await generateKeyPair();
    const publicKey = await exportPublicKey(keyPair.publicKey);
    expect(typeof publicKey).toBe("string");
  });

  test("Export Private Key returns a string", async () => {
    const keyPair = await generateKeyPair();
    const privateKey = await exportPrivateKey(keyPair.privateKey);
    expect(typeof privateKey).toBe("string");
  });

  test("Import Public Key returns a CryptoKey", async () => {
    const keyPair = await generateKeyPair();
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const importedKey = await importPublicKey(publicKey);
    expect(importedKey).toBeInstanceOf(CryptoKey);
  });

  test("Import Private Key returns a CryptoKey", async () => {
    const keyPair = await generateKeyPair();
    const privateKey = await exportPrivateKey(keyPair.privateKey);
    const importedKey = await importPrivateKey(privateKey);
    expect(importedKey).toBeInstanceOf(CryptoKey);
  });

});


describe("AES Keys", () => {
  test("Generate Key returns a CryptoKey", async () => {
    const key = await generateKey();
    expect(key).toBeInstanceOf(CryptoKey);
  });

  test("Export Key returns a string", async () => {
    const key = await generateKey();
    const exportedKey = await exportKey(key);
    expect(typeof exportedKey).toBe("string");
  });

  test("Import Key returns a CryptoKey", async () => {
    const key = await generateKey();
    const exportedKey = await exportKey(key);
    const importedKey = await importKey(exportedKey);
    expect(importedKey).toBeInstanceOf(CryptoKey);
  });
});