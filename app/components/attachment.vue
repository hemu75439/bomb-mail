<script setup lang="ts">
import { defineProps } from 'vue';
import { Trash } from 'lucide-vue-next';

const props = defineProps({
    attachments: {
        type: Array,
        required: true
    }
});

function addUrl() {
    if (props.attachments.length < 5) {
        props.attachments.push('');
    }
}

function removeUrl(index) {
    props.attachments.splice(index, 1);
}
</script>

<template>
    <Card class="h-full rounded">
        <div v-for="(url, index) in attachments" :key="index" class="p-4 flex gap-3">
            <Input
                class="rounded w-full max-w-[800px]"
                v-model="attachments[index]"
                placeholder="Enter attachment URL"
                :maxlength="2048"
            />
            <button v-if="attachments.length > 0" @click="removeUrl(index)">
                <Trash class="outline-none" :size="20" />
            </button>
        </div>
        <button
            class="p-4 pl-5"
            @click="addUrl"
            v-if="attachments.length < 5"
        >
            + Add Attachment
        </button>
    </Card>
</template>
