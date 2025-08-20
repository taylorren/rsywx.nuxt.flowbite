<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold dark:text-white flex items-center gap-4">
        藏书列表
        <span class="text-base font-normal text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          第 {{ currentPage }} / {{ totalPages }} 页
        </span>
      </h1>
    </div>
    
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
            <td class="py-4 px-6">
              <a :href="`/books/${book.bookid}.html`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ book.title }}
              </a>
            </td>
            <td class="py-4 px-6">
              <a :href="`/books/list/author/${encodeURIComponent(book.author)}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ book.author }}
              </a>
            </td>
            <td class="py-4 px-6">{{ book.region }}</td>
            <td class="py-4 px-6">{{ book.location }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex flex-col gap-4 mt-4">
        <div class="flex items-center justify-center gap-2">
          <button 
            :disabled="currentPage === 1"
            @click="goToPage(1)"
            class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
            title="跳转到第一页"
          >
            首页
          </button>
          <button 
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
            title="跳转到上一页"
          >
            上一页
          </button>
          <div class="flex items-center gap-2 px-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700 dark:text-gray-400">跳转到：</span>
              <input 
                type="number" 
                v-model="jumpToPage" 
                @keyup.enter="handleJumpToPage"
                min="1" 
                :max="totalPages"
                class="w-16 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
              <button 
                @click="handleJumpToPage"
                class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
              >
                跳转
              </button>
            </div>
          </div>
          <button 
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
            title="跳转到下一页"
          >
            下一页
          </button>
          <button 
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
            class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
            title="跳转到最后一页"
          >
            末页
          </button>
        </div>

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
const jumpToPage = ref<number>();

// Handle page jump
const handleJumpToPage = () => {
  if (jumpToPage.value) {
    const pageNum = parseInt(jumpToPage.value.toString());
    if (pageNum >= 1 && pageNum <= totalPages.value) {
      goToPage(pageNum);
      jumpToPage.value = undefined;
    }
  }
};

// Parse route params
const getRouteParams = () => {
  const params = route.params.params as string[];
  
  // Handle different URL patterns
  let type = 'id', value = '', page = 1;
  
  if (params && params.length > 0) {
    // First parameter could be either a type or a page number
    if (params[0] === 'id' || /^\d+$/.test(params[0])) {
      // It's either 'id' or a page number
      type = 'id';
      page = /^\d+$/.test(params[0]) ? parseInt(params[0]) : 1;
    } else {
      // It's a type (author, etc)
      type = params[0];
      if (params.length > 1) {
        value = params[1];
        // Check if there's a page number
        if (params.length > 2 && /^\d+$/.test(params[2])) {
          page = parseInt(params[2]);
        }
      }
    }
  }
  
  return { type, value, page };
};

// Fetch books
const fetchBooks = async () => {
  const { type, value, page } = getRouteParams();
  pending.value = true;
  error.value = null;
  
  try {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;
    const apiKey = config.public.apiKey;
    
    // Construct the URI path segments
    const pathSegments = ['/books/list'];
    
    // Only add type if it's not 'id' or empty
    if (type && type !== 'id') {
      pathSegments.push(type);
      // Only add value if type is not 'id'
      if (value) {
        pathSegments.push(value);
      }
    }
    
    // Always add page number
    pathSegments.push(page.toString());
    
    // Join with '/' and ensure no double slashes
    const uri = `${apiBase}${pathSegments.join('/')}`;
    
    const response = await $fetch<BookListResponse>(uri, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    
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
  const { type } = getRouteParams();
  const segments = ['/books/list'];
  
  // Only add type and value if type is not 'id'
  if (type && type !== 'id') {
    segments.push(type);
    const value = route.params.params?.[1];
    if (value) {
      segments.push(value);
    }
  }
  
  // Add page number if not first page
  if (page > 1) {
    segments.push(page.toString());
  }
  
  router.push(segments.join('/'));
};

// Watch for route changes
watch(() => route.params, fetchBooks, { immediate: true });
</script>
