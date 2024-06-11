<script setup lang="ts">
import { ref } from 'vue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-vue-next';
import { type CampaignStatus } from '@/lib/schema/campaign';
const { apiBase } = useRuntimeConfig().public;
const router = useRouter();

const campaign = ref({
    name: 'New Campaign',
    status: 'incomplete',

    subject: '',
    credentials: [],
    recipients: [],
    sender_name: '',
    random_sender_name: false,
    delay: 0,
    delay_after: 0,
    attachments: [],
    random_header: false,

    body: '',
    html_code: '',
    html_code_type: '',
    interactive_body: ''
});

const status = ref<CampaignStatus>('incomplete');
const emailSent = ref<number>(0);
const totalRecipients = ref<number>(0);
const verifyEmails = ref<any>(null);
const openDrawer = ref<boolean>(false);

let statusCheckTimeout = null;

const route = useRoute();
if(route?.params?.id !== 'new') {
    const response: any = await $fetch(apiBase + 'campaign/' + route.params.id);
    campaign.value = {...response.data};
    if(campaign.value.status == 'in-progress') {
        startCampaign()
    }
} else {
    const response = await $fetch(apiBase + 'campaign', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({...campaign.value})
        });
    router.push(response?.data?.id)
}

async function updateCampaign(data) {
    return await $fetch(apiBase + 'campaign/' + campaign.value._id, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
}

async function modifyCampaign() {
    const response = await updateCampaign({...campaign.value});

    if(response?.data?.oAuthUrls?.length) {
        verifyEmails.value = response?.data?.oAuthUrls;
        openDrawer.value = true
    } else {
        startCampaign();
    }
}

async function checkCampaignStatus() {
    const response: any = await $fetch(apiBase + 'campaign/' + route.params.id + '/status');
    console.log(response)
    if(response.data.status == 'in-progress') {
        emailSent.value = response.data.emailSent;
        totalRecipients.value = response.data.totalRecipients;
        statusCheckTimeout = setTimeout(() => checkCampaignStatus(), 5000);
    }
    status.value = response.data.status;
}

function startCampaign() {
    updateCampaign({status: 'in-progress'});
    totalRecipients.value = campaign.value.recipients.length;
    status.value = 'in-progress';
    statusCheckTimeout = setTimeout(() => checkCampaignStatus(), 5000);
}

async function cancelCampaign() {
    updateCampaign({status: 'incomplete'});
    status.value = 'incomplete';
}

</script>


<template>
    <div class="h-full flex flex-col">
        <Header :title="campaign.name" :back-btn="true" />
        <div class="grow p-4">
            <Card class="h-full rounded flex flex-col">
                <div class="flex items-center justify-start gap-3 p-4">
                    <Input class="rounded w-[500px]" placeholder="Campaign Name" maxlength="50" v-model="campaign.name" />
    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Info class="outline-none" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Campaign name can only be 50 characters long.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
    
                <div class="grow p-4">
                    <Accordion type="single" class="px-2" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <span class="flex items-center justify-start gap-3">
                                    Sending Options
        
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger as-child>
                                                <Info class="outline-none" :size="20" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Information needed to send email such as Recipients and Credentials.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <SendingOptions :sending-options="campaign" />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
        
                    <Accordion type="single" class="px-2" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <span class="flex items-center justify-start gap-3">
                                    Email Contents
        
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger as-child>
                                                <Info class="outline-none" :size="20" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Contents that will be sent in the email.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <EmailContent :email-content="campaign" />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div class="flex items-center justify-between px-4 py-2 border-t">
                    <CampaignStatus :status="status" :emailSent="emailSent" :totalRecipients="totalRecipients" />
                    
                    <CampaignButton v-model="status" @update-campaign="modifyCampaign"
                        @cancel-campaign="cancelCampaign" />
                </div>
            </Card>

            <Drawer :open="openDrawer">
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerDescription class="text-center">Verify these emails to start Campaign</DrawerDescription>
                    </DrawerHeader>
                    <div class="flex justify-center">
                        <EmailVerification :verify-emails="verifyEmails" />
                    </div>
                    <DrawerFooter class="items-center">
                        <Button variant="outline" class="rounded px-5" size="lg" 
                            @click="() => {
                                startCampaign();
                                openDrawer = false;
                            }">Done</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    </div>
</template>