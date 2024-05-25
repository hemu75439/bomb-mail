<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';

    const isMobile = ref(false);
    const handleResize = () => isMobile.value = window.innerWidth < 768 ;

    onMounted(() => {
        isMobile.value = window.innerWidth < 768;
        window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => window.removeEventListener('resize', handleResize));


    import {VisuallyHidden} from 'radix-vue';
    import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
    import { Menu, Pin } from 'lucide-vue-next';
    import { Separator } from '@/components/ui/separator';
    import { nav } from '@/lib/navigation';
    
    const router = useRouter();

    const channels = useState('channels', () => [
        {
            name: 'Action',
            pinned: true
        },
        {
            name: 'Drama',
            pinned: true
        },
        {
            name: 'Romance',
            pinned: false
        },
        {
            name: 'Comedy',
            pinned: false
        },
        {
            name: 'Drama',
            pinned: true
        },
        {
            name: 'Romance',
            pinned: false
        },
        {
            name: 'Comedy',
            pinned: false
        },
        {
            name: 'Drama',
            pinned: true
        },
        {
            name: 'Romance',
            pinned: false
        },
        {
            name: 'Comedy',
            pinned: false
        },
        {
            name: 'Romcom',
            pinned: false
        }
    ]);

    import {
        Collapsible,
        CollapsibleContent,
        CollapsibleTrigger,
    } from '@/components/ui/collapsible';
    
    const isFavouriteChannelsOpen = ref(false);
    const isAllChannelsOpen = ref(false);

    function changePinnedState(index:number) {
    }
</script>

<template>
    <Sheet>
        <SheetTrigger><Menu /></SheetTrigger>
        <SheetContent side="left" class="w-[200px] sm:w-[200px] overflow-y-scroll">
            <VisuallyHidden>
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
            </VisuallyHidden>

            <SheetDescription>
                <div v-if="!isMobile" class="mb-5">
                    <template v-for="item in nav">
                        <div class="py-2 px-4 flex-1 flex items-center justify-center cursor-pointer" @click="router.push(item.route)">
                            <div class="w-[100px] flex items-center justify-start gap-2">
                                <span class="w-[25px] flex justify-center">
                                    <component :is="item.content"></component>
                                </span> 
                                {{ item.name }}
                            </div>
                        </div>
                        <Separator v-if="item.separator" />
                    </template>
                </div>
            

                <div v-if="channels.filter(i => i?.pinned).length" class="transition-all ease-in-out delay-150">
                    <p class="text-xs mb-1">Favourite Channels</p>
                    <template v-for="item, index in channels.filter(i => i?.pinned)">
                        <div class="px-4 py-1 flex items-center justify-between">
                            <span class="pb-1">{{ item.name }}</span>
                            <Pin size="16" :fill="item.pinned && 'red'" @click="item.pinned = !item.pinned" />
                        </div>
                    </template>
                    <Separator class="mt-3"/>
                </div>
                
                <div class="mt-5">
                    <p class="text-xs mb-1">All Channels</p>

                    <template v-for="item in channels.slice(0, 5)">
                        <div class="px-4 py-1 flex items-center justify-between">
                            <span class="pb-1">{{ item.name }}</span>
                            <Pin size="16" :fill="item.pinned && 'red'" @click="item.pinned = !item.pinned" />
                        </div>
                    </template>
                    <Collapsible v-model:open="isAllChannelsOpen">
                        <CollapsibleTrigger v-if="!isAllChannelsOpen">
                            <p class="text-xs text-end px-3 outline-0">Show More</p>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <template v-for="item in channels.slice(5)">
                                <div class="px-4 py-1 flex items-center justify-between">
                                    <span class="pb-1">{{ item.name }}</span>
                                    <Pin size="16" :fill="item.pinned && 'red'" @click="item.pinned = !item.pinned" />
                                </div>
                            </template>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
                
            </SheetDescription>

        </SheetContent>
      </Sheet>
</template>