<script setup lang="ts">
import { ref } from 'vue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-vue-next';
import { type CampaignStatus } from '@/lib/schema/campaign-status';

const route = useRoute();
console.log(route.params.id)

const campaign = ref({
    name: 'Campaign 1'
});

const status = ref<CampaignStatus>('incomplete');
const emailSent = ref<number>(70);
const totalRecipients = ref<number>(200);

function updateStatus(newStatus: CampaignStatus) {
    status.value = newStatus;
}
</script>


<template>
    <div class="h-full flex flex-col">
        <Header :title="campaign.name" />
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
                                                <Info class="outline-none" size="20" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Information needed to send email such as Recipients and Credentials.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <SendingOptions />
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
                                                <Info class="outline-none" size="20" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Contents that will be sent in the email.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <EmailContent />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div class="flex items-center justify-between px-4 py-2 border-t">
                    <CampaignStatus :status="status" :emailSent="emailSent" :totalRecipients="totalRecipients" />
                    
                    <CampaignButton v-model="status" @update-status="updateStatus" />
                </div>
            </Card>
        </div>
    </div>
</template>