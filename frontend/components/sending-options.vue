<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-vue-next';
import * as XLSX from 'xlsx';

const props = defineProps<{ sendingOptions }>();

const subject = ref(null);
const recipients = ref(null);
const appPassword = ref(false);

function updateRecipients(val) {
    props.sendingOptions.recipients = val.split(',');
}

async function updateCreds(e: Event) {
    const files =  e?.target?.files;
    if(files.length) {
        props.sendingOptions.credentials = [];
        if(appPassword.value) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const data = e?.target?.result;
                const workbook = XLSX.read(data, { type: 'buffer' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const content = XLSX.utils.sheet_to_txt(worksheet);
                const credList = content.split('\n');
                credList.forEach(e => {
                    const data = e.split('\t');
                    props.sendingOptions.credentials.push({
                        email: data[0],
                        type: 'app-password',
                        app_password: data[2]
                    });
                });
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            };
            reader.readAsArrayBuffer(files[0]);
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
            <Label>Sender Email</Label>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Info class="outline-none" :size="20" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Sender email will be used from provided Google API credentials.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="credentials">Google API Credential(s)</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px] text-start"
                    type="file" id="credentials" @change="updateCreds"
                    :multiple="!appPassword" :accept="appPassword ? '.xlsx' : '.json'" />
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

        <div class="flex flex-col gap-2 p-4">
            <Label for="recipients">Recipient(s)</Label>
            <div class="flex items-start justify-start gap-3">
                <Textarea id="recipients" placeholder="eg: abcd@gmail.com, xyz@gmail.com" 
                    class="rounded w-full max-w-[500px] h-[300px]" @update:modelValue="updateRecipients" />

                <Button variant="outline" class="rounded" @click="recipients.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="recipients">
        </div>

        <div class="flex flex-col gap-2 p-4">
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
        </div>

    </Card>
</template>