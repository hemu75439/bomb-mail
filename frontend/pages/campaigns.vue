<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Plus } from 'lucide-vue-next';
const { apiBase } = useRuntimeConfig().public;

const statusColorCode = {
  'complete': 'green',
  'failed': 'red',
  'in-progress': 'seagreen',
  'incomplete': 'orange'
}

const campaigns = ref([]);
const totalCampaigns = ref(0);
const currentPage = ref(1);
const limit = ref(10);



async function getCampaignsList() {
  try {
    const response: any = await $fetch(apiBase + `campaign/list?limit=${limit.value}&page=${currentPage.value}`);
    campaigns.value = response.data.campaigns;
    totalCampaigns.value = response.data.totalCampaigns;
    currentPage.value = response.data.currentPage;
  } catch(e) {
    console.log('Error in getting campaigns list')
  }
}

function pageChanged(page) {
  currentPage.value = page;
  getCampaignsList();
}

getCampaignsList();
</script>

<template>
  <div class="h-full flex flex-col">
    <Header title="Campaigns" />

    <div class="grow p-4">
      <Card class="h-full rounded flex flex-col">
        <CardHeader>
          <div class="flex justify-between">

            <div class="relative w-full max-w-sm items-center">
              <Input id="search" type="text" placeholder="Search..." class="pl-10 rounded" />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="size-6 text-muted-foreground" />
              </span>
            </div>

            <NuxtLink to="/campaign/new">
              <Button class="rounded">
                  <Plus :size="20" />
                  <span class="text-lg ms-2">New Campaign</span>
              </Button>
            </NuxtLink>
          </div>
        </CardHeader>
        <CardContent class="grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-2/6">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableEmpty v-if="!campaigns?.length">
                Let's start your email journey, click here
                <NuxtLink to="/campaign/new">
                  <Button class="ms-2 rounded">
                      <Plus :size="20" />
                      <span class="text-lg ms-2">New Campaign</span>
                  </Button>
                </NuxtLink>
              </TableEmpty>
              <template v-for="campaign in campaigns">
                <TableRow>
                  <TableCell class="w-2/6 cursor-default">
                    <NuxtLink :to="'/campaign/' + campaign._id">
                      {{ campaign.name }}
                    </NuxtLink>
                  </TableCell>

                  <TableCell>
                    <Badge :style="`background-color: ${statusColorCode[campaign.status]};`"
                      class="text-white cursor-default">
                      {{ campaign.status }}
                    </Badge>
                  </TableCell>

                  <TableCell class="cursor-default">
                    {{ new Date(campaign.createdAt).toLocaleString() }}
                  </TableCell>

                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <NuxtLink :to="'/campaign/' + campaign._id">
                            <Eye class="ms-2 cursor-pointer outline-none" />
                          </NuxtLink>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View the details of this campaign</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter class="p-3 pt-0">

          <Pagination v-slot="{ page }" :total="totalCampaigns" :itemsPerPage="limit" 
            :sibling-count="1" show-edges :default-page="1" class="mx-auto"
              @update:page="pageChanged">
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst class="rounded" />
              <PaginationPrev class="rounded" />

              <template v-for="(item, index) in items">
                <PaginationListItem class="rounded" v-if="item.type === 'page'" :key="index" :value="item.value"
                  as-child>
                  <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext class="rounded" />
              <PaginationLast class="rounded" />
            </PaginationList>
          </Pagination>

        </CardFooter>
      </Card>
    </div>
  </div>
</template>