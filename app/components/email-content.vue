<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-vue-next';

defineProps<{ emailContent }>();

const htmlCodeTypes = ['img', 'pdf', 'img-pdf'];

const body = ref(null);
const htmlCode = ref(null);
const interactiveBody = ref(null);
</script>

<template>
    <Card class="h-full rounded">

        <div class="flex flex-col gap-2 p-4">
            <Label for="recipients">Body</Label>
            <div class="flex items-start justify-start gap-3">
                <Textarea id="recipients" placeholder="" class="rounded w-full max-w-[500px] h-[200px]"
                    v-model="emailContent.body" />

                <Button variant="outline" class="rounded" @click="body.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="recipients">
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="recipients">HTML Code</Label>
            <div class="flex items-start justify-start gap-3">
                <Textarea id="recipients" placeholder="" class="rounded w-full max-w-[500px] h-[200px]"
                    v-model="emailContent.html_code" />

                <div>
                    <Button variant="outline" class="rounded mb-3" @click="htmlCode.click()">
                        Import
                    </Button>

                    <Select v-model="emailContent.html_code_type">
                        <SelectTrigger class="w-[150px] rounded outline-none">
                            <SelectValue placeholder="HTML code type" />
                        </SelectTrigger>
                        <SelectContent class="rounded outline-none">
                            <SelectGroup>
                                <template v-for="t in htmlCodeTypes">
                                    <SelectItem :value="t">
                                        {{ t }}
                                    </SelectItem>
                                </template>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="recipients">
        </div>

        <div class="flex flex-col gap-2 p-4">
            <Label for="recipients">Interactive Body</Label>
            <div class="flex items-start justify-start gap-3">
                <Textarea id="recipients" placeholder="" class="rounded w-full max-w-[500px] h-[200px]"
                    v-model="emailContent.interactive_body" />

                <Button variant="outline" class="rounded" @click="interactiveBody.click()">Import</Button>
            </div>
            <input class="invisible h-0 w-0" type="file" ref="recipients">
        </div>

    </Card>
</template>