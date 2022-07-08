import { EncPrefix, KeyType } from "./constants";
import { arrayBufferToBase64, base64ToArrayBuffer, decodeData, encodeData } from "./utils"

export type RSAEncryptionResult = {
    data: string
}

export async function encryptRSA(data: any, publicKey: CryptoKey): Promise<RSAEncryptionResult> {
    const encoded = encodeData(data);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: KeyType.RSAOAEP
        },
        publicKey,
        encoded
    );
                        // format: prefix:data
    const encryptedB64 = `${EncPrefix.RSA}:${arrayBufferToBase64(encryptedData)}`;

    return {
        data: encryptedB64
    }
}

export async function decryptRSA(data: string, privateKey: CryptoKey): Promise<any> {
    const splitDataForPrefix = data.split(':');

    if (splitDataForPrefix.length != 2) throw new Error('Not prefixed');
    if (EncPrefix.RSA !== splitDataForPrefix[0]) throw new Error('Not RSA prefixed');

    const cipherText = base64ToArrayBuffer(splitDataForPrefix[1]);

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: KeyType.RSAOAEP
        },
        privateKey,
        cipherText
    );

    return decodeData(decryptedData);
}