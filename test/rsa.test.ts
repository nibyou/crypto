import {
  decryptRSA,
  encryptRSA,
  generateKeyPair
} from '../src';

import { PREFIX_RSA } from '../src/lib/constants';

const plaintext = 'Hello World';
const plainObject = {
    hello: 'world',
}

const fail = {
    noPrefix: 'VWtdjrr+hu57f2vtJLTxftGOBBIe6/W7NKn5RbLUjxKiHwxAhYBxXdqfdiWxFbpwMxsG94xgQZCL6kcLa97Mj5PE0Hjcd/dNKeNpvIpWOeM/b2iEN83FcrS+8qo0rWnckdcJPdUYtNnBE+QlrYzYJ0kJP0irCFTcVguj5CKpW5D16oRYrNBgweQ9A8J+OLi80yduKr3JX9FLWlYgq3j69QCIJ56h3klvJQbakIc6qZ2+In34RbxKOH5Tj9Y/FyxW4LT37dMgWRgnnpscBl/T6IojPdwqeENmEhveQxfzkEzhmqm3k1zs/tugyjxdPyDMYmpsANA6rPf4C0yW8Ch4dWh2XfLAfSh98EgWqSzmkjCryzyqBdILHJxErxhDSUbkSmtXR+fLajdddqQJG2erJHECisna433+/43F7tC3ytrV/LClawi64ekfGdWqO/waHBOUsbx7+g4mC6mlhNLfy0C/xiNRChHA4nd/D+dAc8o1cXpk5qyFQq3H8J/5Oa8mpddHbVCThdqECNgsl0FWJQHCh795I8JzDLUJa8pCP3gmj0zaba6Xjbb/8Tf9/Nv5BHFEnUJPNJA6x4iCH7BF8Q/mRaRndTMQXLxrgX6gat80iI3R/r9+ZBUdXVxTNpLcJf2kR92+AqKrKaCYlTOIJeiXcz6dgW6jPQkx3PSFTFw=',
    noRSAPrefix: ':VWtdjrr+hu57f2vtJLTxftGOBBIe6/W7NKn5RbLUjxKiHwxAhYBxXdqfdiWxFbpwMxsG94xgQZCL6kcLa97Mj5PE0Hjcd/dNKeNpvIpWOeM/b2iEN83FcrS+8qo0rWnckdcJPdUYtNnBE+QlrYzYJ0kJP0irCFTcVguj5CKpW5D16oRYrNBgweQ9A8J+OLi80yduKr3JX9FLWlYgq3j69QCIJ56h3klvJQbakIc6qZ2+In34RbxKOH5Tj9Y/FyxW4LT37dMgWRgnnpscBl/T6IojPdwqeENmEhveQxfzkEzhmqm3k1zs/tugyjxdPyDMYmpsANA6rPf4C0yW8Ch4dWh2XfLAfSh98EgWqSzmkjCryzyqBdILHJxErxhDSUbkSmtXR+fLajdddqQJG2erJHECisna433+/43F7tC3ytrV/LClawi64ekfGdWqO/waHBOUsbx7+g4mC6mlhNLfy0C/xiNRChHA4nd/D+dAc8o1cXpk5qyFQq3H8J/5Oa8mpddHbVCThdqECNgsl0FWJQHCh795I8JzDLUJa8pCP3gmj0zaba6Xjbb/8Tf9/Nv5BHFEnUJPNJA6x4iCH7BF8Q/mRaRndTMQXLxrgX6gat80iI3R/r9+ZBUdXVxTNpLcJf2kR92+AqKrKaCYlTOIJeiXcz6dgW6jPQkx3PSFTFw=',
}

describe("RSA Encryption", () => {
    test("Encrypt text", async () => {
        const keyPair = await generateKeyPair(true);
        const encrypted = await encryptRSA(plaintext, keyPair.publicKey);
        expect(typeof encrypted.data).toBe("string");
        expect(encrypted.data).toMatch(new RegExp(`^${PREFIX_RSA}`));
    });
    test("Encrypt object", async () => {
        const keyPair = await generateKeyPair(true);
        const encrypted = await encryptRSA(plainObject, keyPair.publicKey);
        expect(typeof encrypted.data).toBe("string");
        expect(encrypted.data).toMatch(new RegExp(`^${PREFIX_RSA}`));
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
    test("Decrypt fail", async () => {
        const keyPair = await generateKeyPair(true);
        expect(() => decryptRSA(fail.noPrefix, keyPair.privateKey)).rejects.toThrow('Not prefixed');
        expect(() => decryptRSA(fail.noRSAPrefix, keyPair.privateKey)).rejects.toThrow('Not RSA prefixed');
    });
});