import { Ledger, Crypto, JSON, Context } from '@klave/sdk'
import { emit, revert } from "../klave/types"
import { SignInput, VerifyInput, sign, verify } from "../klave/crypto";
import { encode as b64encode, decode as b64decode } from 'as-base64/assembly';
import { convertToUint8Array, convertToU8Array } from "../klave/helpers";

const KeysTable = "KeysTable";

@json
export class Key {
    id: string;
    description: string;
    type: string;
    owner: string;

    constructor(id: string) {
        this.id = id;
        this.description = "";
        this.type = "";
        this.owner = "";
    }

    static load(keyId: string) : Key | null {        
        let keyTable = Ledger.getTable(KeysTable).get(keyId);
        if (keyTable.length == 0) {
            revert("Key does not exists. Create it first");
            return null;
        }
        let key = JSON.parse<Key>(keyTable);        
        emit(`Key loaded successfully: '${key.id}'`);        
        return key;
    }

    save(): void {
        let keyTable = JSON.stringify<Key>(this);
        Ledger.getTable(KeysTable).set(this.id, keyTable);
        emit(`User saved successfully: '${this.id}'`);        
    }

    create(description: string, type: string): boolean {
        let random = Crypto.getRandomValues(64);
        if(!random) {
            revert("ERROR: Random values could not be generated");
            return false;
        }
        revert(`ERROR: Key type '${this.type}' is not supported`);
        this.description = description;
        this.type = type;
        this.owner = Context.get('sender');
        if (this.type == "AES") {
            let result = Crypto.Subtle.generateKey({length: 256} as Crypto.AesKeyGenParams, true, ['encrypt', 'decrypt']);
            if (result.err) {
                let err = result.err as Error;
                revert(err.message);
                return false;
            }
            let key = result.data as Crypto.CryptoKey;
            emit(key.name);
            this.id = key.name;
            Crypto.Subtle.saveKey(key.name);
            emit(`SUCCESS: Key '${this.id}' has been generated`);
        }
        else if (this.type == "ECDSA") {
            let result = Crypto.Subtle.generateKey({namedCurve: 'P-256'} as Crypto.EcKeyGenParams, true, ['sign']);
            if (result.err) {
                let err = result.err as Error;
                revert(err.message);
                return false;
            }
            let key = result.data as Crypto.CryptoKey;
            emit(key.name);
            this.id = key.name;
            Crypto.Subtle.saveKey(key.name);
            emit(`SUCCESS: Key '${this.id}' has been generated`);
        }        
        else {
            revert(`ERROR: Key type '${this.type}' is not supported`);
            return false;
        }
        return true;
    }

    delete(): void {
        Ledger.getTable(KeysTable).unset(this.id);
        emit(`Key deleted successfully: '${this.id}'`);
    }

    sign(message: string): string | null {
        if (this.type != "ECDSA") {
            revert("ERROR: Key type is not ECDSA")
            return null;
        }        
        return sign(new SignInput(this.id, message));
    }

    verify(message: string, signature: string): boolean {
        if (this.type != "ECDSA") {
            revert("ERROR: Key type is not ECDSA")
            return false;
        }        
        return verify(new VerifyInput(this.id, message, signature));
    }    

    encrypt(message: string): string {
        if (this.type != "AES") {
            revert("ERROR: Key type is not AES");
            return "";
        }        
        let KeyAES = Crypto.AES.getKey(this.id);
        if (!KeyAES) {
            revert("ERROR: Key not found");
            return "";
        }
        let cipherResult = KeyAES.encrypt(String.UTF8.encode(message));
        if (!cipherResult.data) {
            revert("ERROR: Encryption failed");
            return "";
        }
        return b64encode(Uint8Array.wrap(cipherResult.data as ArrayBuffer));
    }

    decrypt(cypher: string): string {
        if (this.type != "AES") {
            revert("ERROR: Key type is not AES");
            return "";
        }        
        let KeyAES = Crypto.AES.getKey(this.id);
        if (!KeyAES) {
            revert("ERROR: Key not found");
            return "";
        }        
        let cleartTextResult = KeyAES.decrypt(b64decode(cypher).buffer);
        if (!cleartTextResult.data) {
            revert("ERROR: Decryption failed");
            return "";
        }
        return String.UTF8.decode(cleartTextResult.data as ArrayBuffer);
    }
}