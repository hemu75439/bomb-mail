<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Plus } from 'lucide-vue-next';

const statusColorCode = {
  'complete': 'green',
  'failed': 'red',
  'in-progress': 'seagreen',
  'incomplete': 'orange'
}

const taskList = ref(
  [
    {
      id: 1,
      name: "Task 1",
      status: "in-progress",
      created: "2024-05-26T17:46:59.833Z"
    },
    {
      id: 2,
      name: "Task 2",
      status: "failed",
      created: "2024-05-26T17:46:59.833Z"
    },
    {
      id: 3,
      name: "Task 3",
      status: "complete",
      created: "2024-05-26T17:46:59.833Z"
    },
    {
      id: 4,
      name: "Task 4",
      status: "incomplete",
      created: "2024-05-26T17:46:59.833Z"
    },
    {
      id: 5,
      name: "Task 5",
      status: "in-progress",
      created: "2024-05-26T17:46:59.833Z"
    },
  ]
)
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

            <NuxtLink to="/campaign/1">
              <Button class="rounded">
                  <Plus size="20" />
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
              <TableEmpty v-if="!taskList?.length">
                Let's start your email journey, click here
                <Button class="ms-2 rounded">
                  <Plus size="20" />
                  <span class="text-lg ms-2">New Campaign</span>
              </Button>
              </TableEmpty>
              <template v-for="task in taskList">
                <TableRow>
                  <TableCell class="w-2/6 cursor-default">
                    {{ task.name }}
                  </TableCell>

                  <TableCell>
                    <Badge :style="`background-color: ${statusColorCode[task.status]};`"
                      class="text-white cursor-default">
                      {{ task.status }}
                    </Badge>
                  </TableCell>

                  <TableCell class="cursor-default">
                    {{ new Date(task.created).toLocaleString() }}
                  </TableCell>

                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Eye class="ms-2 cursor-pointer outline-none" @click="console.log(task.id)" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View the details of this task</p>
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

          <Pagination v-slot="{ page }" :total="100" :sibling-count="1" show-edges :default-page="1" class="mx-auto">
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