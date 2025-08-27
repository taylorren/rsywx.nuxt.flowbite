<template>
  <form @submit.prevent="handleSearch" class="flex gap-2">
    <div class="flex-1">
      <input 
        type="text" 
        v-model="searchQuery"
        class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="搜索书籍..."
      >
    </div>
    <button 
      type="submit"
      class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      :disabled="!searchQuery.trim()"
    >
      搜索
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  
  router.push({
    path: `/books/list/misc/${encodeURIComponent(searchQuery.value)}/1`
  });
};
</script>
