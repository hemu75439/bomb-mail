<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';

    const isMobile = ref(false);
    const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
    };

    onMounted(() => {
    isMobile.value = window.innerWidth < 768;
    window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    });

    import { nav } from '@/lib/navigation';
    import { Separator } from '@/components/ui/separator';
    
    const router = useRouter();
</script>

<template>
    <Separator />
    <div v-if="isMobile" class="flex items-center">
        <template v-for="item in nav">
            <div class="p-4 flex-1 flex items-center justify-center" @click="router.push(item.route)">
                <component :is="item.content" size="28"></component>
            </div>
            <div class="h-full py-3">
                <Separator orientation="vertical" v-if="item.separator" />
            </div>
        </template>
    </div>
</template>