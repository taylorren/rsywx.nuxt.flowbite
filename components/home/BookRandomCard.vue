<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <!-- Header with title and refresh button -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold flex items-center dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-7 h-7 mr-3">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        手气不错
      </h2>

      <button @click="handleRefresh" :disabled="isLoading"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none transition-colors"
        :class="{
          'bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800': !isLoading,
          'bg-gray-500 cursor-not-allowed': isLoading,
        }">
        <template v-if="isLoading">
          <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          刷新中...
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-4 h-4 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          换一批
        </template>
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!randomBooks || randomBooks.length === 0" class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">暂无随机书籍</p>
    </div>

    <!-- 4-book horizontal grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(book, index) in displayedBooks" :key="book.bookid || index" class="group cursor-pointer">
        <a :href="`/books/${book.bookid}.html`" class="block">
          <!-- Book cover -->
          <div class="mb-3">
            <img :src="`/covers/${book.bookid}.webp`" :alt="`《${book.title}》- ${book.author}`"
              :title="`《${book.title}》\n作者：【${book.region || '未知'}】${book.author}\n出版社：${book.publisher_name}\n点击查看详情`"
              class="w-full h-64 object-cover rounded-lg hover:opacity-90 transition-opacity" @error="handleImageError"
              @load="handleImageLoad" />
          </div>

          <!-- Book info -->
          <div class="space-y-1">
            <h3
              class="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors overflow-hidden"
              style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{ book.title }}
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
              【{{ book.region || '未知' }}】{{ book.author }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 truncate">
              {{ book.publisher_name }}
            </p>
          </div>
        </a>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import type { RandomBook } from '~/types/book';
import { ref, computed, nextTick } from 'vue';

const props = defineProps<{
  randomBooks: RandomBook[] | null | undefined;
}>();

const emit = defineEmits(['refresh']);
const isLoading = ref(false);


// Display up to 4 books
const displayedBooks = computed(() => {
  if (!props.randomBooks || props.randomBooks.length === 0) {
    return [];
  }
  return props.randomBooks.slice(0, 4);
});

const handleRefresh = async () => {
  isLoading.value = true;
  emit('refresh');

  // Simulate loading time. In real app, the parent component's refresh should handle this.
  setTimeout(async () => {
    // Wait for the DOM to update with the new randomBooks data
    await nextTick();
    isLoading.value = false;
  }, 800);
};

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  console.error('❌ Image failed to load:', img.src);
  // Use a data URL for a simple gray placeholder
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyAxMDVIMTEzVjEzMUg4N1YxMDVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik03NSAxNDNIMTI1VjE0N0g3NVYxNDNaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MyAxNTNIMTE3VjE1N0g4M1YxNTNaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
};


</script>
