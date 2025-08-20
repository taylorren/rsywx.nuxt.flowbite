<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold dark:text-white">手气不错</h1>
      <button
        @click="refreshBooks"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="pending"
      >
        <svg 
          class="w-4 h-4"
          :class="{ 'animate-spin': pending }"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        换一批
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending && !books.length" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Books Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="book in books" :key="book.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <a :href="`/books/${book.bookid}.html`" class="block">
          <img 
            :src="`/covers/${book.bookid}.webp`"
            :alt="book.title"
            class="w-full h-64 object-cover"
            onerror="this.onerror=null; this.src='/images/no-cover.webp';"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ book.title }}</h3>
            <div class="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
              <p>作者：{{ book.author }}</p>
              <p>出版：{{ book.publisher_name }} ({{ book.place_name }})</p>
              <p class="text-xs">访问：{{ book.total_visits }} 次</p>
              <p class="text-xs">上次：{{ book.last_visited }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBooks } from '~/composables/useBooks';
import type { RandomBook } from '~/types/book';

const books = ref<RandomBook[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);

const { randomBook, randomBookError, refreshRandomBook } = useBooks();

const fetchRandomBooks = async () => {
  pending.value = true;
  error.value = null;
  
  try {
    await refreshRandomBook(9);
    if (randomBookError.value) {
      error.value = randomBookError.value.message;
    } else if (randomBook.value) {
      books.value = randomBook.value;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败';
  } finally {
    pending.value = false;
  }
};

// Refresh books with animation
const refreshBooks = () => {
  fetchRandomBooks();
};

// Initial fetch
onMounted(fetchRandomBooks);
</script>
