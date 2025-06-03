<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
    <div>
      <h2 class="text-xl font-semibold mb-2 flex items-center dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        &nbsp;&nbsp;久未访问
      </h2>
      <a :href="`/books/${book?.bookid}.html`">
        <img class="rounded-t-lg" :src="`https://api.rsywx.com/covers/${book?.bookid}.jpg`"
          :alt="`${book?.title}`" />
      </a>
      <br />
      <p class="mb-4 dark:text-gray-300">
        久未访问的书籍是
        <a :href="`/books/${book?.bookid}.html`" class="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          《{{ book?.title }}》
        </a>
        ，上次访问时间是{{ book?.lvt }}，已有{{ book?.vc }}次访问。
      </p>
    </div>
    <a :href="`/books/${book?.bookid}.html`"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-start">
      浏览详情
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { ForgetBook } from '~/types/book';

defineProps<{
  book: ForgetBook | null | undefined;
}>();
</script>