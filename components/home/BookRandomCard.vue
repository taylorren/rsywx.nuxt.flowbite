<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
    <div>
      <h2 class="text-xl font-semibold mb-2 flex items-center dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        &nbsp;&nbsp;手气不错
      </h2>
      <a v-if="randomBook" :href="`/books/${randomBook.bookid}.html`">
        <img class="rounded-t-lg" :src="randomBook.img" :alt="randomBook.title" />
      </a>
      <br />
      <p class="mb-4 dark:text-gray-300" v-if="randomBook">
        为您呈现的随机藏书是{{ randomBook.author }}的
        <a :href="`/books/${randomBook.bookid}.html`" class="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          《{{ randomBook.title }}》
        </a>
        ，收录于{{ randomBook.purchdate }}。
      </p>
    </div>
    <div class="flex items-center">
      <a v-if="randomBook" :href="`/books/${randomBook.bookid}.html`"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-start h-10">
        浏览详情
        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </a>
      <button @click="handleRefresh" :disabled="isLoading"
        class="inline-flex items-center px-3 py-2 ms-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-4 focus:outline-none  self-start h-10"
        :class="{
          'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800':
            !isLoading,
          'bg-gray-500 cursor-not-allowed': isLoading,
        }">
        <template v-if="isLoading">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          刷新中...
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RandomBook } from '~/types/book';
import { ref, nextTick } from 'vue';

defineProps<{
  randomBook: RandomBook | null | undefined;
}>();

const emit = defineEmits(['refresh']);
const isLoading = ref(false);

const handleRefresh = async () => {
  isLoading.value = true;
  emit('refresh');

  // Simulate loading time. In real app, the parent component's refresh should handle this.
  // Also, in a real app, you would get a new randomBook from the parent component
  // instead of using a setTimeout.
  setTimeout(async () => {
    // Wait for the DOM to update with the new randomBook data
    await nextTick();
    isLoading.value = false;
  }, 500);
};
</script>