<script setup lang="ts">
    import { User } from 'lucide-vue-next';
    const router = useRouter()
    defineProps<{
        title?: string
    }>()
</script>

<template>
    <div class="flex items-center justify-between gap-4 p-4">
        <div class="flex items-center gap-4">
            <SideNav />
        </div>

        <div class="flex items-center gap-4"> 
            <div class="text-lg" v-if="title">{{ title }}</div>

            <Avatar class="cursor-pointer" @click="router.push('/account')"><User /></Avatar>
        </div>
    </div>
</template>
