<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
// import { onMounted } from 'vue'

  // onMounted(async () => {
  //   const time = await window?.ipcRenderer?.invoke('app-start-time')
  //   console.log('App start time:', time)
  // })

  let layout: string = "default";
  const route = useRoute();
  if(route.path.includes('/auth/')) {
    layout = 'auth';
  }
</script>


<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-right" />
</template>