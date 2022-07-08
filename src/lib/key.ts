import { HashTypes, KeyFormat, KeyType } from "./constants";
import { base64ToArrayBuffer, exportSomeKey } from "./utils";

export async function deriveKey(data: string, iterations: number = 10000): Promise<CryptoKey> {
    var saltBuffer = crypto.getRandomValues(new Uint8Array(8));
    var encoder = new TextEncoder();
    var passphraseKey = encoder.encode(data);

    const key = await crypto.subtle.importKey(KeyFormat.RAW, passphraseKey, {name: KeyType.PBKDF2}, false, ['deriveBits', 'deriveKey'])

    return crypto.subtle.deriveKey(
        { 
            "name": KeyType.PBKDF2,
            "salt": saltBuffer,
            "iterations": iterations,
            "hash": HashTypes.SHA256
        },
        key,
        { 
            "name": KeyType.AESGCM, 
            "length": 256 
        },
        true,
        [ "encrypt", "decrypt" ]
    )

}

export async function generateKeyPair(extractable: boolean = true): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
        {
            name: KeyType.RSAOAEP,
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: HashTypes.SHA256
        },
        extractable,
        ["encrypt", "decrypt"]
    );
}

export async function importPrivateKey(base64: string, extractable: boolean = false): Promise<CryptoKey> {
    const binaryDer = base64ToArrayBuffer(base64);
  
    return crypto.subtle.importKey(
        KeyFormat.PKCS8,
      binaryDer,
      {
        name: KeyType.RSAOAEP,
        hash: HashTypes.SHA256,
      },
      extractable,
      ["decrypt"]
    );
  }

export async function importPublicKey(base64: string, extractable: boolean = false): Promise<CryptoKey> {
    const binaryDer = base64ToArrayBuffer(base64);

    return crypto.subtle.importKey(
        KeyFormat.SPKI,
      binaryDer,
      {
        name: KeyType.RSAOAEP,
        hash: HashTypes.SHA256,
      },
      extractable,
      ["encrypt"]
    );
  }

export async function exportPrivateKey(key: CryptoKey): Promise<string> {
    return exportSomeKey(KeyFormat.PKCS8, key);
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
    return exportSomeKey(KeyFormat.SPKI, key);
}

export async function generateKey(extractable: boolean = true): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
        { 
            "name": KeyType.AESGCM, 
            "length": 256 
        },
        extractable,
        [ "encrypt", "decrypt" ]
    )
}

export async function importKey(base64: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        KeyFormat.RAW,
        base64ToArrayBuffer(base64),
        { 
            "name": KeyType.AESGCM, 
            "length": 256 
        },
        false,
        [ "encrypt", "decrypt" ]
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
   return exportSomeKey(KeyFormat.RAW, key);
}