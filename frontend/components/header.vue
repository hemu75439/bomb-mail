<script setup lang="ts">
import { User, MoveLeft } from 'lucide-vue-next';
const router = useRouter()
defineProps<{
    title?: string;
    backBtn?: boolean;
}>()
</script>

<template>
    <div class="flex items-center justify-between gap-4 p-4">
        <div class="flex items-center gap-4">
            <!-- <SideNav /> -->
            <NuxtLink to="/campaigns">
                <MoveLeft v-if="backBtn" class="cursor-pointer" :size="30" />
            </NuxtLink>
            <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight" v-if="title">{{ title }}
            </h2>
        </div>

        <div class="flex items-center gap-4">
            <!-- <Avatar class="cursor-pointer" @click="router.push('/account')">
                <User />
            </Avatar> -->
        </div>
    </div>
</template>
