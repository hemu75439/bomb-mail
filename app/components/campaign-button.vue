<script setup lang="ts">
import { type CampaignStatus } from '@/lib/schema/campaign';
import { Plus, Ban, Play } from 'lucide-vue-next';

defineProps<{ modelValue: CampaignStatus }>();
const emit = defineEmits(['updateCampaign', 'cancelCampaign', 'newCampaign']);
</script>

<template>
    <Button v-if="modelValue == 'failed' || modelValue == 'incomplete'" class="rounded px-5" size="lg" 
        @click="emit('updateCampaign')">
        <Play :size="20" />
        <span class="text-lg ms-2">Start</span>
    </Button>
    <Button v-if="modelValue == 'in-progress'" class="rounded px-5" size="lg" variant="secondary"
        @click="emit('cancelCampaign')">
        <Ban :size="20" />
        <span class="text-lg ms-2">Cancel</span>
    </Button>
    <NuxtLink v-if="modelValue == 'complete'" to="/campaign/new">
        <Button class="rounded" @click="emit('newCampaign')">
            <Plus :size="20" />
            <span class="text-lg ms-2">New Campaign</span>
        </Button>
    </NuxtLink>
</template>