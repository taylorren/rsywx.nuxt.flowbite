<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">藏书列表</h1>
    
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">书号</th>
            <th scope="col" class="py-3 px-6">书名</th>
            <th scope="col" class="py-3 px-6">作者</th>
            <th scope="col" class="py-3 px-6">地区</th>
            <th scope="col" class="py-3 px-6">位置</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="py-4 px-6">
              <a :href="`/books/${book.bookid}.html`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ book.bookid }}
              </a>
            </td>
            <td class="py-4 px-6">{{ book.title }}</td>
            <td class="py-4 px-6">{{ book.author }}</td>
            <td class="py-4 px-6">{{ book.region }}</td>
            <td class="py-4 px-6">{{ book.location }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4">
        <button 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          上一页
        </button>
        <span class="text-sm text-gray-700 dark:text-gray-400">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        <button 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import type { BookListItem, BookListResponse } from '~/types/bookList';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const books = ref<BookListItem[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

// Parse route params
const getRouteParams = () => {
  const params = route.params.params as string[];
  return {
    type: params?.[0] || 'id',
    value: params?.[1] || '',
    page: parseInt(params?.[2] || '1')
  };
};

// Fetch books
const fetchBooks = async () => {
  const { type, value, page } = getRouteParams();
  pending.value = true;
  error.value = null;
  
  try {
    const apiBase = config.public.apiBase;
    const response = await $fetch<BookListResponse>(`${apiBase}/books/list/${type}/${value}/${page}`);
    
    if (response.success) {
      books.value = response.data;
      currentPage.value = response.pagination.current_page;
      totalPages.value = response.pagination.total_pages;
    } else {
      error.value = '获取数据失败';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败';
  } finally {
    pending.value = false;
  }
};

// Navigation
const goToPage = (page: number) => {
  const { type, value } = getRouteParams();
  router.push(`/books/list/${type}/${value}/${page}`);
};

// Watch for route changes
watch(() => route.params, fetchBooks, { immediate: true });
</script>
