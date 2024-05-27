<script setup lang="ts">
import { type CampaignStatus } from '@/lib/schema/campaign-status';
import { Plus, Ban, Play } from 'lucide-vue-next';

defineProps<{ modelValue: CampaignStatus }>();
const emit = defineEmits(['updateStatus']);

function updateStatus(status: CampaignStatus) {
    emit('updateStatus', status);
}
</script>

<template>
    <Button v-if="modelValue == 'incomplete'" class="rounded px-5" size="lg" @click="updateStatus('in-progress')">
        <Play size="20" />
        <span class="text-lg ms-2">Send</span>
    </Button>
    <Button v-if="modelValue == 'in-progress'" class="rounded px-5" size="lg" variant="secondary"
        @click="updateStatus('failed')">
        <Ban size="20" />
        <span class="text-lg ms-2">Cancel</span>
    </Button>
    <NuxtLink v-if="modelValue == 'failed' || modelValue == 'complete'" to="/campaign/new">
        <Button class="rounded" @click="updateStatus('incomplete')">
            <Plus size="20" />
            <span class="text-lg ms-2">New Campaign</span>
        </Button>
    </NuxtLink>
</template>