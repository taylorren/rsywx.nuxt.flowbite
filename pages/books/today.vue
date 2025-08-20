<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold dark:text-white">历史上的今天（{{ formattedDate }}）购买的书籍</h1>
    </div>

    <!-- Loading State -->
    <div v-if="pending || !hasLoaded" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- No Books State -->
    <div v-else-if="hasLoaded && !books.length" class="text-center py-8 text-gray-600 dark:text-gray-400">
      历史上的今天没有购买过书籍
    </div>

    <!-- Books List -->
    <div v-else-if="books.length > 0" class="space-y-6">
      <div v-for="book in books" :key="book.id" 
        class="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <a :href="`/books/${book.bookid}.html`" class="hover:text-blue-600 dark:hover:text-blue-400">
              {{ book.title }}
            </a>
          </h3>
          <div class="space-y-2 text-gray-600 dark:text-gray-400">
            <p class="flex items-center gap-2">
              <span class="font-medium">作者：</span>
              <a :href="`/books/list/author/${encodeURIComponent(book.author)}`" 
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ book.author }}
              </a>
              <span v-if="book.translated" class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">译作</span>
            </p>
            <p v-if="book.copyrighter">
              <span class="font-medium">译者：</span>{{ book.copyrighter }}
            </p>
            <p class="flex items-center gap-2">
              <span class="font-medium">购入时间：</span>
              <span class="text-green-800 dark:text-green-300">
                {{ calculateYearsAgo(book.purchdate) }}年前
              </span>
            </p>
            <p v-if="book.price">
              <span class="font-medium">价格：</span>¥{{ book.price.toFixed(2) }}
            </p>
            <p>
              <span class="font-medium">收藏：</span>{{ book.location || '未知' }}
            </p>
          </div>
        </div>
        <div class="md:w-48 flex-shrink-0">
          <img 
            :src="`/covers/${book.bookid}.webp`"
            :alt="book.title"
            class="w-full h-64 md:h-72 object-cover rounded"
            onerror="this.onerror=null; this.src='/images/no-cover.webp';"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBooks } from '~/composables/useBooks';
import type { TodayBook } from '~/types/book';

const books = ref<TodayBook[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);
const hasLoaded = ref(false);

const formattedDate = new Date().toLocaleDateString('zh-CN', {
  month: 'long',
  day: 'numeric'
});

const calculateYearsAgo = (purchdate: string) => {
  const purchase = new Date(purchdate);
  const today = new Date();
  const yearDiff = today.getFullYear() - purchase.getFullYear();
  return yearDiff;
};

// Get books from the composable
const { todayBook, todayBookError, loadTodayBook } = useBooks();

const fetchTodayBooks = async () => {
  pending.value = true;
  error.value = null;
  hasLoaded.value = false;
  
  try {
    await loadTodayBook();
    if (todayBookError.value) {
      error.value = todayBookError.value.message;
    } else if (todayBook.value) {
      books.value = todayBook.value;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败';
  } finally {
    pending.value = false;
    hasLoaded.value = true;
  }
};

// Initial fetch
onMounted(fetchTodayBooks);
</script>
