import {
  generateKey,
  encryptAES,
  decryptAES
} from '../dist';

const plaintext = "Hello World!";
const plainObject = {
  hello: "world",
};

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
});