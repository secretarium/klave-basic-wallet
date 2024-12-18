import {Notifier, JSON} from "@klave/sdk"

@json
export class ErrorMessage {
    success!: boolean;
    message!: string;
}

export function revert(message: string) : void {
    Notifier.sendJson<ErrorMessage>({
        success: false,
        message: message
    });    
    
}

export function emit(message: string) : void {
    Notifier.sendJson<ErrorMessage>({
        success: true,
        message: message
    });
}

