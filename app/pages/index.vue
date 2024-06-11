<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { Progress } from '@/components/ui/progress';
const router = useRouter();

const progress = ref(13)

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value = 66, 500)
  cleanupFn(() => clearTimeout(timer))
})

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value = 85, 750)
  cleanupFn(() => clearTimeout(timer))
})

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value = 98, 1000)
  cleanupFn(() => clearTimeout(timer))
})

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => router.push('/campaigns'), 1200)
  cleanupFn(() => clearTimeout(timer))
})
</script>


<template>
  <div class="h-full flex items-center justify-center flex-col gap-5">
    <img src="../public/img/bombmailer-logo.png" alt="Bomb-Mailer" width="260">
    <Progress v-model="progress" class="w-[250px]" />
  </div>
</template>