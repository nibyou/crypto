import {
  AES_GCM,
  DECRYPT,
  DERIVEBITS,
  DERIVEKEY,
  ENCRYPT,
  PBKDF2,
  PKCS8,
  RAW,
  RSA_OAEP,
  SHA256,
  SPKI
} from './constants';
import { base64ToArrayBuffer, exportSomeKey } from './utils';

export async function deriveKey(data: string, iterations: number = 10000, salt?: string): Promise<CryptoKey> {
    const saltBuffer = salt ? base64ToArrayBuffer(salt) : crypto.getRandomValues(new Uint8Array(8));
    const encoder = new TextEncoder();
    const passphraseKey = encoder.encode(data);

    const key = await crypto.subtle.importKey(RAW, passphraseKey, {name: PBKDF2}, false, [DERIVEBITS, DERIVEKEY])

    return crypto.subtle.deriveKey(
        { 
            "name": PBKDF2,
            "salt": saltBuffer,
            "iterations": iterations,
            "hash": SHA256
        },
        key,
        { 
            "name": AES_GCM,
            "length": 256 
        },
        true,
        [ENCRYPT, DECRYPT]
    )

}

export async function generateKeyPair(extractable: boolean = true): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
        {
            name: RSA_OAEP,
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: SHA256
        },
        extractable,
        [ENCRYPT, DECRYPT]
    );
}

export async function importPrivateKey(base64: string, extractable: boolean = false): Promise<CryptoKey> {
    const binaryDer = base64ToArrayBuffer(base64);
  
    return crypto.subtle.importKey(
      PKCS8,
      binaryDer,
      {
        name: RSA_OAEP,
        hash: SHA256,
      },
      extractable,
      [DECRYPT]
    );
  }

export async function importPublicKey(base64: string, extractable: boolean = false): Promise<CryptoKey> {
    const binaryDer = base64ToArrayBuffer(base64);

    return crypto.subtle.importKey(
      SPKI,
      binaryDer,
      {
        name: RSA_OAEP,
        hash: SHA256,
      },
      extractable,
      [ENCRYPT]
    );
  }

export async function exportPrivateKey(key: CryptoKey): Promise<string> {
    return exportSomeKey(PKCS8, key);
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
    return exportSomeKey(SPKI, key);
}

export async function generateKey(extractable: boolean = true): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
        { 
            "name": AES_GCM,
            "length": 256 
        },
        extractable,
        [ ENCRYPT, DECRYPT ]
    )
}

export async function importKey(base64: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        RAW,
        base64ToArrayBuffer(base64),
        { 
            "name": AES_GCM,
            "length": 256 
        },
        false,
        [ ENCRYPT, DECRYPT ]
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
   return exportSomeKey(RAW, key);
}