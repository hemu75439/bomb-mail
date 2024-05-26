<script setup lang="ts">
    import { VisuallyHidden } from 'radix-vue';
    import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
    import { Separator } from '@/components/ui/separator';
    import { nav } from '@/lib/navigation';
    const router = useRouter();
</script>

<template>
    <Sheet>
        <SheetTrigger>
            <img src="/img/bombmailer-logo-min.png" alt="Bomb-mailer" width="40">
        </SheetTrigger>
        <SheetContent side="left" class="w-[200px] sm:w-[200px] overflow-y-scroll">
            <VisuallyHidden>
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
            </VisuallyHidden>

            <SheetDescription>
                <div class="mt-5 flex justify-center">
                    <img src="/img/bombmailer-logo.png" alt="Bomb-mailer" width="100" height="45">
                </div>
                <div class="my-5">
                    <template v-for="item in nav">
                        <div class="py-3 px-4 flex-1 flex items-center justify-center cursor-pointer" @click="router.push(item.route)">
                            <div :class="
                                'w-[100px] flex items-center justify-start gap-2 text-lg' + 
                                (router.currentRoute.value.fullPath === item.route ? ' text-muted':'')
                            ">
                                <span class="w-[25px] flex justify-center">
                                    <component :is="item.content"></component>
                                </span> 
                                {{ item.name }}
                            </div>
                        </div>
                        <Separator v-if="item.separator" />
                    </template>
                </div>
                <div class="text-center absolute bottom-4 left-0 right-0">
                    <p>V 1.0.0</p>
                    <p class="text-lg">Bomb Mailer</p>
                    <p>&#169; Copyright {{new Date().getFullYear()}}</p>
                </div>
            </SheetDescription>

        </SheetContent>
      </Sheet>
</template>