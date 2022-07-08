import { EncPrefix, KeyType } from "./constants";
import { arrayBufferToBase64, base64ToArrayBuffer, decodeData, encodeData } from './utils';
import { exportKey } from "./key";

export type AESEncryptionResult = {
    data: string,
    key: string,
}

export async function encryptAES(data: any, key: CryptoKey): Promise<AESEncryptionResult> {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encoded = encodeData(data);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: KeyType.AESGCM,
            iv: iv
        },
        key,
        encoded
    );
                        // format: prefix:data.iv
    const encryptedB64 = `${EncPrefix.AES}:${arrayBufferToBase64(encryptedData)}.${arrayBufferToBase64(iv)}`;
    const keyB64 = await exportKey(key!);

    return {
        data: encryptedB64,
        key: keyB64
    }
}

export async function decryptAES(data: string, key: CryptoKey): Promise<any> {
    const splitDataForPrefix = data.split(':');

    if (splitDataForPrefix.length != 2) throw new Error('Not prefixed');
    if (EncPrefix.AES !== splitDataForPrefix[0]) throw new Error('Not AES prefixed');

    const splitForCipherText = splitDataForPrefix[1].split('.');

    if (splitForCipherText.length != 2) throw new Error('Cipher Text malformed');

    const cipherText = base64ToArrayBuffer(splitDataForPrefix[0]);
    const iv = base64ToArrayBuffer(splitDataForPrefix[1]);

    if (iv.byteLength != 12) throw new Error('IV malformed');

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: KeyType.AESGCM,
            iv: iv
        },
        key,
        cipherText
    );

    return decodeData(decryptedData);
}