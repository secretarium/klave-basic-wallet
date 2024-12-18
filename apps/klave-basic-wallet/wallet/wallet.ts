import { Ledger, JSON, Context } from "@klave/sdk";
import { emit, revert } from "../klave/types";
import { Key } from "./key";
import { User } from "./user";

const WalletTable = "WalletTable";

/**
 * An Wallet is associated with a list of users and holds keys.
 */
@json
export class Wallet {    
    name: string;
    keys: Array<string>;
    users: Array<string>;

    constructor() {
        this.name = "";
        this.keys = new Array<string>();
        this.users = new Array<string>();
    }
    
    /**
     * load the wallet from the ledger.
     * @returns true if the wallet was loaded successfully, false otherwise.
     */
    static load(): Wallet | null {
        let walletTable = Ledger.getTable(WalletTable).get("ALL");
        if (walletTable.length == 0) {
            revert("Wallet does not exists. Create it first");
            return null;
        }
        let wlt = JSON.parse<Wallet>(walletTable);
        emit("Wallet loaded successfully: " + walletTable);
        return wlt;
    }
 
    /**
     * save the wallet to the ledger.
     */
    save(): void {
        let walletTable = JSON.stringify<Wallet>(this);
        Ledger.getTable(WalletTable).set("ALL", walletTable);
        emit("Wallet saved successfully: " + walletTable);
    }

    /**
     * Create a wallet with the given name.
     * Also adds the sender as an admin user.
     * @param name 
     */
    create(name: string): void {
        this.name = name;
        this.addUser(Context.get('sender'), "admin", true);
        emit("Wallet created successfully: " + this.name);        
        return;
    }
    
    /**
     * Add a user to the wallet.
     * @param userId The id of the user to add.
     * @param role The role of the user to add.
     */
    addUser(userId: string, role: string, force: boolean): boolean {
        if (!force && !this.senderIsAdmin())
        {
            revert("You are not allowed to add a user");
            return false;
        }

        let existingUser = User.load(userId);
        if (existingUser) {
            revert("User already exists: " + userId);
            return false;
        }
        let user = new User(userId);
        user.role = role;
        user.save();
        this.users.push(userId);        
        emit("User added successfully: " + userId);
        return true;
    }

    /**
     * Remove a user from the wallet.
     * @param userId The id of the user to remove.
     */
    removeUser(userId: string): boolean {
        if (!this.senderIsAdmin())
        {
            revert("You are not allowed to remove a user");
            return false;
        }

        let user = User.load(userId);
        if (!user) {
            revert("User not found: " + userId);
            return false;
        }
        user.delete();

        let index = this.users.indexOf(userId);
        this.users.splice(index, 1);
        emit("User removed successfully: " + userId);
        return true;
    }

    /**
     * Check if the sender is an admin.
     * @returns True if the sender is an admin, false otherwise.
     */
    senderIsAdmin(): boolean {
        let user = User.load(Context.get('sender'));
        if (!user) {
            return false;
        }
        return user.role == "admin";
    }

    /**
     * Check if the sender is registered.
     * @returns True if the sender is registered, false otherwise.
     */
    senderIsRegistered(): boolean {
        let user = User.load(Context.get('sender'));
        if (!user) {
            return false;
        }
        return true;
    }

    /**
     * list all the keys in the wallet.
     * @returns 
     */
    listKeys(user: string): void {
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to list the keys in the wallet");
            return;
        }        

        let keys: string = "";
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i];
            let keyObj = Key.load(key);
            if (!keyObj) {
                revert(`Key ${key} does not exist`);
                continue;
            }            
            if (keys.length > 0) {
                keys += ", ";
            }
            if (user.length == 0 || keyObj.owner == user) {
                keys += JSON.stringify<Key>(keyObj);
            }
        }
        if (keys.length == 0) {
            emit(`No keys found in the wallet`);
        }
        emit(`Keys in the wallet: ${keys}`);
    }

    /**
     * Sign a message with the given key.
     * @param keyId The id of the key to sign with.
     * @param payload The message to sign.
     */
    sign(keyId: string, payload: string): string | null {
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to sign a message/access this wallet");
            return null;
        }
        let key = Key.load(keyId);
        if (!key) {
            return null;
        }
        return key.sign(payload);        
    }

    /**
     * Verify a signature with the given key.
     * @param keyId The id of the key to verify with.
     * @param payload The message to verify.
     * @param signature The signature to verify.
     */
    verify(keyId: string, payload: string, signature: string): boolean {
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to verify a signature/access this wallet");
            return false;
        }
        let key = Key.load(keyId);
        if (!key) {
            return false;
        }
        return key.verify(payload, signature);        
    }

    /**
     * Create a key with the given description and type.
     * @param description The description of the key.
     * @param type The type of the key.
     */
    addKey(description: string, type: string): boolean {
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to add a key/access this wallet");
            return false;
        }
        let key = new Key("");
        key.create(description, type);
        key.save();

        this.keys.push(key.id);
        return true;
    }

    /**
     * Remove a key from the wallet.
     * @param keyId The id of the key to remove.
     */
    removeKey(keyId: string): boolean {
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to remove a key/access this wallet");
            return false;
        }
        let key = Key.load(keyId);
        if (!key) {
            return false;
        }
        key.delete();

        let index = this.keys.indexOf(keyId);
        this.keys.splice(index, 1);
        return true;
    }

    /**
     * encrypt a message with the given key.
     */
    encrypt(keyId: string, message: string): string | null {
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to encrypt a message/access this wallet");
            return null;
        }
        let key = Key.load(keyId);
        if (!key) {
            return null;
        }
        return key.encrypt(message);        
    }

    /**
     * encrypt a message with the given key.
     */
    decrypt(keyId:string, cypher: string): string | null{
        if (!this.senderIsRegistered())
        {
            revert("You are not allowed to encrypt a message/access this wallet");
            return null;
        }
        let key = Key.load(keyId);
        if (!key) {
            return null;
        }
        return key.decrypt(cypher);        
    }

}