import { JSON, Crypto } from "@klave/sdk";
import { convertToUint8Array, convertToU8Array } from "./helpers";
import { emit } from "./types";
import { encode as b64encode, decode as b64decode } from 'as-base64/assembly';

@json
export class SignInput {
    keyName: string;
    message: string;

    constructor(keyName: string, message: string) {
        this.keyName = keyName;
        this.message = message;
    }
}

@json
export class VerifyInput {
    keyName: string;
    message: string;
    signature: string;

    constructor(keyName: string, message: string, signature: string) {
        this.keyName = keyName;
        this.message = message;
        this.signature = signature;
    }
}

export function sign(input: SignInput): string {
    let signature : string = "";
    const key = Crypto.ECDSA.getKey(input.keyName);
    if(key)
    {
        emit(`Signing message: ${input.message} - with key: ${input.keyName}`);
        let signatureResult = key.sign(String.UTF8.encode(input.message));
        if(!signatureResult.data) {
            emit("ERROR: Signature could not be generated");
            return signature;
        }
        let signatureBytes = Uint8Array.wrap(signatureResult.data as ArrayBuffer);
        signature = b64encode(signatureBytes);
        emit(`Signature: ${signature}`);
    }
    return signature;
}

export function verify(input: VerifyInput): boolean {
    const key = Crypto.ECDSA.getKey(input.keyName);
    if (key) {        
        emit(`Verifying message: ${input.message} - with signature: ${input.signature}`);
        let signatureAsBytes = b64decode(input.signature);
        let verificationResult = key.verify(String.UTF8.encode(input.message), signatureAsBytes.buffer);
        if (!verificationResult.data) {
            emit("ERROR: Verification failed");
            return false;
        }
        return (verificationResult.data as Crypto.SignatureVerification).isValid;
    } 
    return false;
}