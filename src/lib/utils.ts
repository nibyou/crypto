const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
    return btoa(
        String.fromCharCode(
            ...new Uint8Array(arrayBuffer)
        )
    );
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    return Uint8Array.from(
        atob(base64), 
        c => c.charCodeAt(0)
    );
}

export async function exportSomeKey(format: "pkcs8" | "raw" | "spki", key: CryptoKey): Promise<string> {
    const abKey = await crypto.subtle.exportKey(format, key);

    return arrayBufferToBase64(abKey);
}

export function encodeData(data: any): Uint8Array {
    if (typeof data === 'object') data = JSON.stringify(data);

    return encoder.encode(data.toString());
}

export function decodeData(data: any): any {
    const decodedData = decoder.decode(data);

    try {
        return JSON.parse(decodedData)
    } catch (_) {
        return decodedData;
    }
}

// stackoverflow.com/a/42321673/6634591
export function getRandomInt(min: number, max: number): number {
    const randomBuffer = new Uint32Array(1);

    crypto.getRandomValues(randomBuffer);

    let randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}