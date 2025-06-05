<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <Header />
    <main class="flex-grow bg-gray-50 dark:bg-gray-800 py-6">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
</script>