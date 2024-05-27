<script setup lang="ts">
import { type CampaignStatus } from '@/lib/schema/campaign-status';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Info, CircleX, CircleCheck } from 'lucide-vue-next';

defineProps<{
    status: CampaignStatus,
    emailSent: number,
    totalRecipients: number
}>()
</script>

<template>
    <div class="flex items-center">
        <div v-if="status == 'complete'" class="flex items-center">
            <CircleCheck class="me-2" /> Complete
        </div>
        <div v-if="status == 'in-progress'" class="flex items-center">
            <Spinner class="me-2" /> In progress
        </div>
        <div v-if="status == 'failed'" class="flex items-center">
            <CircleX class="me-2" /> Failed
        </div>
        <div v-if="status == 'incomplete'" class="flex items-center">
            <Info class="me-2" /> Fill in all the required details to begin !
        </div>
        
        <Separator v-if="status != 'incomplete'" orientation="vertical" class="mx-5 h-[20px]" />
        <div v-if="status != 'incomplete'">
            {{ `${emailSent} / ${totalRecipients} sent` }}
        </div>
    </div>
</template>