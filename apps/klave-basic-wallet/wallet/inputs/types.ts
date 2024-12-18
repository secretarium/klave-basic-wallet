import { JSON } from "@klave/sdk";

@json
export class CreateWalletInput {
    name: string;
}

@json 
export class SignInput {
    keyId: string;
    payload: string;
}

@json
export class VerifyInput {
    keyId: string;
    payload: string;
    signature: string;    
}

@json 
export class AddUserInput {
    userId: string;
    role: string;
}

@json 
export class RemoveUserInput {
    userId: string;    
}

@json 
export class AddKeyInput {
    description: string;
    type: string;
}

@json 
export class RemoveKeyInput {
    keyId: string;    
}

@json
export class ListKeysInput {
    user: string;
}

@json
export class ResetInput {
    keys: string[];
}
