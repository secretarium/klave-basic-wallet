import { JSON, Crypto } from "@klave/sdk";
import { convertToUint8Array, convertToU8Array } from "./helpers";
import { emit } from "./types";
import { encode as b64encode, decode as b64decode } from 'as-base64/assembly';

@JSON
export class SignInput {
    keyName: string;
    message: string;

    constructor(keyName: string, message: string) {
        this.keyName = keyName;
        this.message = message;
    }
}

@JSON
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
        let signatureU8 = key.sign(input.message);
        if (signatureU8) {
            let signatureBytes = convertToUint8Array(signatureU8);
            signature = b64encode(signatureBytes);
            emit(`Signature: ${signature}`);            
        }        
    }
    return signature;
}

export function verify(input: VerifyInput): boolean {
    const key = Crypto.ECDSA.getKey(input.keyName);
    if (key) {        
        emit(`Verifying message: ${input.message} - with signature: ${input.signature}`);
        let signatureAsBytes = b64decode(input.signature);
        return key.verify(input.message, convertToU8Array(signatureAsBytes));
    } 
    return false;
}