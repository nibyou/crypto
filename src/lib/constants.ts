export enum KeyType {
    PBKDF2 = 'PBKDF2',
    AESGCM = 'AES-GCM',
    RSAOAEP = 'RSA-OAEP',
}

export enum KeyFormat {
    RAW = 'raw',
    PKCS8 = 'pkcs8',
    SPKI = 'spki',
}

export enum HashTypes {
    SHA256 = 'SHA-256',

}

export enum EncPrefix {
    AES = 'senc',
    RSA = 'aenc',
}