<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-2 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
      &nbsp;&nbsp;最新藏书
    </h2>
    <p>最近的藏书是{{ latestBook?.author }}的《{{ latestBook?.title }}》，收录于{{ latestBook?.purchdate }}。</p>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types/book';

defineProps<{
  latestBook: Book | null | undefined;
}>();
</script>