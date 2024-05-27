<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-vue-next';

const campaign = ref({
    subject: '',
    senderName: '',
    randomSenderName: false,
    credentials: null,
    recipients: '',
    delay: 0,
    delayAfter: 0,
    attachments: null
})

const subject = ref(null);
const recipients = ref(null);
</script>

<template>
    <Card class="h-full rounded">
        <div class="flex flex-col gap-2 p-4">
            <Label for="subject">Subject</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px]" placeholder="Eg: Payment Successful" maxlength="100" id="subject"
                    v-model="campaign.subject" />

                <Button variant="outline" class="rounded" @click="subject.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="subject">
        </div>
        <div class="flex flex-col gap-2 p-4">
            <Label for="senderName">Sender Name(s)</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px]" placeholder="Eg: John Doe" maxlength="100" id="senderName"
                    v-model="campaign.senderName" />

                <Checkbox class="rounded" id="randomSenderName" :checked="campaign.randomSenderName"
                    @update:checked="(v: boolean) => campaign.randomSenderName = v" />
                <Label for="randomSenderName">Use random Sender name(s)</Label>
            </div>
        </div>
        <div class="flex items-center justify-start gap-3 p-4">
            <Label>Sender Email</Label>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Info class="outline-none" size="20" />
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
                    type="file" id="credentials" v-model="campaign.credentials" />
            </div>
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="recipients">Recipient(s)</Label>
            <div class="flex items-start justify-start gap-3">
                <Textarea id="recipients" placeholder="eg: abcd@gmail.com, xyz@gmail.com" 
                    class="rounded w-full max-w-[500px] h-[300px]" v-model="campaign.recipients" />

                <Button variant="outline" class="rounded" @click="recipients.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="recipients">
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="attachments">Attachment(s)</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-full max-w-[500px] text-start"
                    type="file" id="attachments" v-model="campaign.attachments" />
            </div>
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="delay">Delay</Label>
            <div class="flex items-center justify-start gap-3">
                <Input class="rounded w-[80px]" type="number" min="0" max="500" id="delay"
                    v-model="campaign.delay" />
                second(s) of delay after
                <Input class="rounded w-[80px]" type="number" min="0" max="500" id="delayAfter"
                    v-model="campaign.delayAfter" />
                number of emails.
            </div>
        </div>

    </Card>
</template>