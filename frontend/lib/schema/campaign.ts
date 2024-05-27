
export interface SendingOptions {
    subject: string;
    credentials: any;
    recipients: string;
    senderName?: string;
    randomSenderName?: boolean;
    delay?: number;
    delayAfter?: number;
    attachments?: any;
    randomHeader?: boolean;
}

export interface EmailContent {
    body?: string;
    htmlCode?: string;
    htmlCodeType?: 'img' | 'pdf' | 'img-pdf';
    interactiveBody?: string;
}

export interface Campaign {
    name: string;
    sendingOptions: SendingOptions;
    emailContent: EmailContent;
}