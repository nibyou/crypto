import {
  generateKey,
  encryptAES,
  decryptAES,
} from '../src';

import { PREFIX_AES } from '../src/lib/constants';

const plaintext = "Hello World!";
const plainObject = {
  hello: "world",
};

const fail = {
  noPrefix: "0OXQZphqpGkRQp8YEEiHEw==",
  noAESPrefix: ":0OXQZphqpGkRQp8YEEiHEw==",
  noIV: `${PREFIX_AES}:cuc6svcdnVoCxLd5kBAPnQ==`,
  ivMalformed: `${PREFIX_AES}:cuc6svcdnVoCxLd5kBAPnQ==.b36`,
}

describe("AES Encryption", () => {
  test("Encrypt text", async () => {
    const key = await generateKey(true);
    const encrypted = await encryptAES(plaintext, key);
    expect(typeof encrypted.data).toBe("string");
  });

  test("Encrypt object", async () => {
    const key = await generateKey(true);
    const encrypted = await encryptAES(plainObject, key);
    expect(typeof encrypted.data).toBe("string");
  });
});

describe("AES Decryption", () => {
  test("Decrypt text", async () => {
    const key = await generateKey(true);
    const encrypted = await encryptAES(plaintext, key);
    const decrypted = await decryptAES(encrypted.data, key);
    expect(decrypted).toBe(plaintext);
  });

  test("Decrypt object", async () => {
    const key = await generateKey(true);
    const encrypted = await encryptAES(plainObject, key);
    const decrypted = await decryptAES(encrypted.data, key);
    expect(decrypted.hello).toBe(plainObject.hello);
  });

  test("Decrypt fail", async () => {
    const key = await generateKey(true);
    expect(() => decryptAES(fail.noPrefix, key)).rejects.toThrow('Not prefixed');
    expect(() => decryptAES(fail.noAESPrefix, key)).rejects.toThrow('Not AES prefixed');
    expect(() => decryptAES(fail.noIV, key)).rejects.toThrow('Cipher Text malformed');
    expect(() => decryptAES(fail.ivMalformed, key)).rejects.toThrow('IV malformed');
  });
});