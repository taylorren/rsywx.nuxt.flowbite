<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  import('flowbite');
})

// Otherwise, dropdown and other effects won't work
</script>