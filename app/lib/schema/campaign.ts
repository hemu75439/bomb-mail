
export interface Credential {
    email: string,
    type: 'oauth' | 'app-password',

    // Gmail app password
    app_password?: string,
    
    // Google Client Secret from setup GMAIL API
    client_id?: string,
    project_id?: string,
    auth_uri?: string,
    token_uri?: string,
    auth_provider_x509_cert_url?: string,
    client_secret?: string,
    redirect_uris?: [string],
}


export interface SendingOptions {
    subject?: string;
    credentials?: [Credential];
    recipients?: [string];
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

export interface Campaign extends EmailContent, SendingOptions {
    name?: string;
    status?: 'complete' | 'in-progress' | 'failed' | 'incomplete';
}

export type CampaignStatus = 'complete' | 'in-progress' | 'failed' | 'incomplete';
