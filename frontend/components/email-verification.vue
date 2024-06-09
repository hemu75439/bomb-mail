<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '@/components/ui/table';

    defineProps<{ verifyEmails }>();

    function openUrl(url: string) {
        window.open(url, '_blank');
    }
</script>

<template>
    <Table class="mx-auto w-[500px] flex justify-center">   
        <TableBody>
            <template v-for="email in verifyEmails">
                <TableRow>
                    <TableCell class="w-2/6 cursor-default">
                      {{ email.email }}
                    </TableCell>
                    <TableCell>
                        <Button class="rounded px-5" size="xs" @click="openUrl(email.authUrl)">Verify</Button>
                    </TableCell>
                </TableRow>
            </template>
        </TableBody>
    </Table>
</template>