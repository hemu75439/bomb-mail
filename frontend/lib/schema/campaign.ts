
export interface SendingOptions {
    subject: string;
    credentials: any;
    recipients: string;
    sender_name?: string;
    random_sender_name?: boolean;
    delay?: number;
    delay_after?: number;
    attachments?: any;
    random_header?: boolean;
}

export interface EmailContent {
    body?: string;
    html_code?: string;
    html_code_type?: 'img' | 'pdf' | 'img-pdf';
    interactive_body?: string;
}

export interface Campaign {
    name: string;
    sending_options: SendingOptions;
    email_content: EmailContent;
}