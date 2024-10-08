<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Info, Copy, TriangleAlert } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import * as XLSX from 'xlsx';
const { apiBase } = useRuntimeConfig().public;

const props = defineProps<{ sendingOptions }>();
const redirectURI =  `${apiBase}campaign/${props.sendingOptions._id}/google-auth/<email>`;

const subject = ref(null);
const recipients = ref(null);
const appPassword = ref(false);

function updateRecipients(val) {
    props.sendingOptions.recipients = val.split(',').map((email: string) => { return {email: email.trim()} });
}

function importRecipients(e: Event) {
    const file =  e?.target?.files[0];
    const reader = new FileReader();

    // function can be improved !!
    if(file && file.type === 'text/csv') {
        reader.onload = (e) => {
            const text = e?.target?.result;
            const lines = text?.split('\n');
            const emails = lines.map(line => {
                const fields = line.split(',');
                return fields[0].trim();
            })
            const userEmails = emails.filter(email => email !== undefined); 
            updateRecipients(userEmails.join(','));
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        reader.readAsText(file);
    } else {
        reader.onload = (e) => {
        try {
            const data = e?.target?.result;
            const workbook = XLSX.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const content = XLSX.utils.sheet_to_json(worksheet);

            // Extract the user_email column
            const userEmails = content.map(row => row['user_email']).filter(email => email !== undefined);

            updateRecipients(userEmails.join(','));
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
        };
        reader.readAsArrayBuffer(file); 
    }
}

async function updateCreds(e: Event) {
    const files =  e?.target?.files;
    if(files.length) {
        props.sendingOptions.credentials = [];
        if(appPassword.value) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                try {
                    const data = e?.target?.result;
                    const csvContent = data.trim(); // Get the CSV content as a string
                    const rows = csvContent.split('\n'); // Split the content into rows
                    
                    rows.forEach((row: any) => {
                        // Split each row into columns based on commas
                        const columns = row.split(',');
                    
                        // Assuming the CSV columns are in the following order: email, app_password
                        if (columns.length >= 2) {
                            props.sendingOptions.credentials.push({
                                email: columns[0].trim(),          // Column 1: Email
                                app_password: columns[1].trim(),   // Column 2: App Password
                                type: 'app-password',
                            });
                        }
                    });
                    console.log(props.sendingOptions)
                } catch (error) {
                    console.error("Error parsing CSV:", error);
                }
            };

            // Read the file as text
            reader.readAsText(files[0]);
        } else {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  try {
                    let cred = JSON.parse(''+e?.target?.result);
                    cred = {
                        email: file.name.replace('.json', ''),
                        type: 'oauth',
                        ...cred.web
                    }
                    props.sendingOptions.credentials.push(cred);
                  } catch (error) {
                    console.error("Error parsing JSON:", error);
                  }
                };
                reader.readAsText(file);
            })
        }
    }
}

function updateAttachments(val) {

}

async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    toast('URL copied!');
}
</script>

<template>
    <Card class="h-full rounded">
        <div class="flex flex-col gap-2 p-4">
            <Label for="subject">Subject</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px]" placeholder="Eg: Payment Successful" maxlength="100" id="subject"
                    v-model="sendingOptions.subject" />

                <Button variant="outline" class="rounded" @click="subject.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="subject">
        </div>
        <div class="flex flex-col gap-2 p-4">
            <Label for="senderName">Sender Name(s)</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px]" placeholder="Eg: John Doe" maxlength="100" id="senderName"
                    v-model="sendingOptions.sender_name" />

                <Checkbox class="rounded" id="randomSenderName" :checked="sendingOptions.random_sender_name"
                    @update:checked="(v: boolean) => sendingOptions.random_sender_name = v" />
                <Label for="randomSenderName">Use random Sender name(s)</Label>
            </div>
        </div>


        <div class="flex items-center justify-start gap-3 p-4">
            <Label for="credentials">Google API Credential(s)</Label>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Info class="outline-none" :size="20" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Sender email will be used from provided Google API credentials emails.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <div class="flex flex-col gap-2 px-4">
            <div class="flex items-start gap-2">
                <TriangleAlert class="outline-none inline-block text-yellow-300" :size="20" />
                <div>
                    <p>
                        Use this url as "Redirect URI" for creating Google JSON API key. <br>
                        Replace '&lt;email&gt;' with your gmail account email. eg: abc@gmail.com
                    </p>
                    <p class="my-2 rounded flex items-center gap-2 cursor-pointer" 
                        @click="copyToClipboard(redirectURI);">
                        <span type="text" class="bg-slate-600 focus:bg-green-600 focus:text-slate-200 px-2 rounded">
                            {{ redirectURI }}
                        </span>
                        <Copy :size="20" class="cursor-pointer" />
                    </p>
                </div>
            </div>

            <template v-for="cred in sendingOptions.credentials">
                <p>{{ cred.email }}</p>
            </template>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px] text-start"
                    type="file" id="credentials" @change="updateCreds"
                    :multiple="!appPassword" :accept="appPassword ? '.csv' : '.json'" />
                <Checkbox class="rounded" id="randomSenderName" :checked="appPassword"
                    @update:checked="(v: boolean) => appPassword = v" />
                <Label for="randomSenderName">Use App Password</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Info class="outline-none" :size="20" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>To use App Password instead of JSON client secret</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>

        <div class="mt-6 flex flex-col gap-2 p-4">
            <Label for="recipients">Recipient(s)</Label>
            <div class="flex items-start justify-start gap-3">
                <Textarea id="recipients" placeholder="eg: abcd@gmail.com, xyz@gmail.com" 
                    :value="sendingOptions.recipients.map(e => e.email).join(', ')"
                    class="rounded w-full max-w-[500px] h-[300px]" @update:modelValue="updateRecipients" />

                <Button variant="outline" class="rounded" @click="recipients.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="recipients" @change="importRecipients">
        </div>

        <!-- <div class="flex flex-col gap-2 p-4">
            <Label for="attachments">Attachment(s)</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px] text-start"
                    type="file" id="attachments"
                    multiple accept=".jpg, .jpeg, .png, .pdf" />
            </div>
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="delay">Delay</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-[80px]" type="number" min="0" max="500" id="delay"
                    v-model="sendingOptions.delay" />
                second(s) of delay after
                <Input class="rounded w-[80px]" type="number" min="0" max="500" id="delayAfter"
                    v-model="sendingOptions.delay_after" />
                number of emails.
            </div>
        </div> -->

    </Card>
</template>