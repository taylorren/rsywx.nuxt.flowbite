<template>
  <div class="container mx-auto px-4 py-8" :key="String(route.params.bookid)">
    <div v-if="status === 'pending'" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">Failed to load book details.</span>
    </div>

    <div v-else-if="bookData">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- 左侧书籍信息 -->
        <div class="w-full md:w-2/3">
          <h1 class="text-3xl font-bold mb-4 dark:text-white">{{ bookData.title }}</h1>

          <div class="mb-6">
            <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                      <span v-if="bookData.translated && bookData.copyrighter">作者 | 译者</span>
                      <span v-else>作者</span>
                    </td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span class="inline-flex items-center gap-2">
                        <span
                          class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">
                          {{ bookData.region }}
                        </span>
                        <span v-if="bookData.translated && bookData.copyrighter">
                          <button @click="navigateToAuthor(bookData.author)"
                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                            {{ bookData.author }}
                          </button>
                          | {{ bookData.copyrighter }}
                        </span>
                        <span v-else>
                          <button @click="navigateToAuthor(bookData.author)"
                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                            {{ bookData.author }}
                          </button>
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">分类</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span
                        class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs">
                        {{ bookData.category || '-' }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">出版社</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.publisher_name }}</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">出版地</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span
                        class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">
                        {{ bookData.place_name }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">出版日期</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.pubdate }}</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">ISBN</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.isbn }}</td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">页数</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.page }}</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">千字数</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.kword }}</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          <!-- 标签 -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2 dark:text-white">标签</h2>
            <div class="flex flex-wrap gap-2 mb-2">
              <button v-for="(tag, index) in bookData.tags" :key="index" @click="navigateToTag(tag)"
                class="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-700 transition-colors cursor-pointer">
                {{ tag }}
              </button>
              <button v-if="!showTagInput" @click="showTagInput = true"
                class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
                title="添加标签">
                +
              </button>
            </div>

            <!-- 内联标签输入 -->
            <div v-if="showTagInput" class="flex gap-2 items-center">
              <input v-model="tagsInput" @keyup.enter="submitTags" @keyup.escape="cancelTagInput" ref="tagInputRef"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入标签，用空格分隔，按回车确认" autofocus />
              <button @click="submitTags" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
                添加
              </button>
              <button @click="cancelTagInput"
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm">
                取消
              </button>
            </div>

            <!-- 成功消息 -->
            <div v-if="showSuccessMessage"
              class="mt-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded animate-fade-in-out dark:bg-green-900 dark:text-green-200">
              标签已成功添加
            </div>
          </div>

          <!-- 简介 -->
          <div class="mb-6" v-if="bookData.intro">
            <h2 class="text-xl font-semibold mb-2 dark:text-white">简介</h2>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <p class="whitespace-pre-line dark:text-gray-200">{{ bookData.intro }}</p>
            </div>
          </div>

          <!-- 评论 -->
          <div v-if="bookData.reviews && bookData.reviews.length > 0" class="mb-8">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">相关评论</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(review, index) in bookData.reviews" :key="index"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <!-- Feature image at top -->
                <div class="aspect-video w-full">
                  <img :src="review.feature || '/covers/' + bookData.bookid + '.webp'" :alt="review.title"
                    class="w-full h-full object-cover" />
                </div>

                <!-- Review content -->
                <div class="p-4">
                  <a :href="review.uri" target="_blank"
                    class="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 block mb-2">
                    {{ review.title }}
                  </a>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ review.datein }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 相关书籍 -->
          <div v-if="relatedBooks.length > 0 || relatedLoading">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">相关书籍</h2>

            <!-- Loading state -->
            <div v-if="relatedLoading" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>

            <!-- Error state -->
            <div v-else-if="relatedError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {{ relatedError }}
            </div>

            <!-- Related books grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div v-for="(item, index) in relatedBooks" :key="index"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                @click="navigateToBook(item.book.bookid)">
                <!-- Book cover -->
                <div class="aspect-[2/3] w-full">
                  <img :src="`/covers/${item.book.bookid}.webp`" :alt="item.book.title + ' 封面'"
                    class="w-full h-full object-cover"
                    @error="(e) => { (e.target as HTMLImageElement).src = '/covers/placeholder.webp' }" />
                </div>

                <!-- Book info -->
                <div class="p-3">
                  <h3 class="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">
                    {{ item.book.title }}
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {{ item.book.author }}
                  </p>

                  <!-- Total score with dynamic coloring -->
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs px-2 py-1 rounded font-medium" :class="getScoreColorClass(item)">
                      {{ Math.round(item.total_score * 100) }}%
                    </span>
                    <span v-if="item.category" class="text-xs px-2 py-1 rounded" :class="{
                      'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100': item.category === 'serendipity',
                      'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100': item.category === 'similar',
                      'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100': item.category === 'discovery',
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100': !['serendipity', 'similar', 'discovery'].includes(item.category)
                    }">
                      {{ getCategoryLabel(item.category) }}
                    </span>
                  </div>

                  <!-- Relationship reasons -->
                  <div v-if="item.relationship_reasons && item.relationship_reasons.length > 0" class="mt-2">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="(reason, reasonIndex) in item.relationship_reasons.slice(0, 2)" :key="reasonIndex"
                        class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {{ reason }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧书籍封面和统计信息 -->
        <div class="w-full md:w-1/3">
          <!-- 书籍封面 -->
          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
            <div class="flex justify-center">
              <img :src="`/covers/${bookid}.webp`" :alt="bookData.title + ' 封面'"
                class="max-w-full h-auto rounded shadow-md border border-gray-200 dark:border-gray-700"
                @error="handleImageError" v-if="showCover" />
              <div v-else
                class="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400">
                <span>暂无封面</span>
              </div>
            </div>
          </div>

          <!-- 收藏信息 -->
          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">收藏信息</h2>
            <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">购买日期</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.purchdate }}</td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">价格</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span
                        class="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                        ¥{{ bookData.price }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">存放位置</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span
                        class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs">
                        {{ bookData.location }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">访问次数</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ formatNumber(bookData.total_visits) }}
                    </td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">最后访问</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.last_visited || '从未访问' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatNumber } from '~/utils/helper';

// Import meta composables
const { generateBookMeta, generateMetaConfig, applyMetaTags } = useSeoMeta();
const { injectBookStructuredData } = useStructuredData();

const route = useRoute();
const router = useRouter();
const bookid = route.params.bookid as string;

// Server-side data fetching for SEO
const { data: bookData, error, status } = await useAsyncData(`book-${bookid}`, async () => {
  try {
    const config = useRuntimeConfig();
    const response: any = await $fetch(`${config.public.apiBase}/books/${bookid}`, {
      headers: {
        'X-API-Key': config.public.apiKey
      }
    });

    if (response.success) {
      return response.data;
    } else {
      throw new Error('Failed to load book details');
    }
  } catch (e) {
    throw e;
  }
});

// Apply meta tags server-side
if (bookData.value) {
  // Generate book meta data
  const bookMeta = generateBookMeta(bookData.value);
  
  // Generate canonical URL
  const canonicalUrl = `https://rsywx.com/books/${bookData.value.bookid}.html`;
  
  // Create complete meta configuration
  const metaConfig = generateMetaConfig({
    ...bookMeta,
    url: canonicalUrl
  }, canonicalUrl);
  
  // Apply meta tags using our custom composable
  applyMetaTags(metaConfig);
  
  // Inject structured data server-side
  injectBookStructuredData(bookData.value);
} else {
  // Apply fallback meta tags server-side
  const fallbackMeta = {
    title: '图书详情 | 任氏有无轩',
    description: '任氏有无轩图书详情页面',
    keywords: ['任氏有无轩', '藏书', '图书详情'],
    type: 'website' as const,
    url: `https://rsywx.com/books/${bookid}.html`
  };
  
  const canonicalUrl = `https://rsywx.com/books/${bookid}.html`;
  const metaConfig = generateMetaConfig(fallbackMeta, canonicalUrl);
  
  applyMetaTags(metaConfig);
}

const showCover = ref(true);

// Related books state
const relatedBooks = ref<any[]>([]);
const relatedLoading = ref(false);
const relatedError = ref<string | null>(null);

// Handle image loading errors
const handleImageError = () => {
  showCover.value = false;
};

// Fetch related books (client-side only, not needed for SEO)
const fetchRelatedBooks = async () => {
  if (!bookid || !bookData.value) return;

  relatedLoading.value = true;
  relatedError.value = null;

  try {
    const config = useRuntimeConfig();
    const response: any = await $fetch(`${config.public.apiBase}/books/${bookid}/related/5`, {
      headers: {
        'X-API-Key': config.public.apiKey
      }
    });

    if (response.success) {
      relatedBooks.value = response.data;
    } else {
      relatedError.value = 'Failed to load related books';
    }
  } catch (e) {
    relatedError.value = e instanceof Error ? e.message : 'Failed to load related books';
  } finally {
    relatedLoading.value = false;
  }
};

onMounted(() => {
  // Fetch related books after component mounts (if book data is available)
  if (bookData.value) {
    fetchRelatedBooks();
  }
});

// Watch for route changes to handle browser back navigation
watch(() => route.params.bookid, (newBookId, oldBookId) => {
  if (newBookId && newBookId !== oldBookId) {
    // Reset related books state
    relatedBooks.value = [];
    relatedLoading.value = false;
    relatedError.value = null;
    showCover.value = true;
    showTagInput.value = false;
    tagsInput.value = '';
    showSuccessMessage.value = false;

    // The page will be re-rendered with new data via useAsyncData
    // Meta tags will be updated server-side automatically
  }
}, { immediate: false });

const showTagInput = ref(false);
const tagsInput = ref('');
const showSuccessMessage = ref(false);
const tagInputRef = ref<HTMLInputElement>();

// 显示成功消息的函数
const showSuccess = () => {
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000); // 3秒后自动消失
};

// 提交标签
const submitTags = async () => {
  if (!tagsInput.value.trim() || !bookData.value) {
    return;
  }

  // 解析标签（用空格分割）
  const inputTags = tagsInput.value.trim().split(/\s+/).filter(tag => tag.length > 0);

  try {
    // 使用新的 API 端点
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api/v1';
    const apiKey = config.public.apiKey as string;

    const response: any = await $fetch(`${apiBase}/books/${bookData.value.bookid}/tags`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: {
        tags: inputTags
      }
    });

    if (response.success) {
      // 清空输入并隐藏输入框
      tagsInput.value = '';
      showTagInput.value = false;

      // 显示成功消息
      showSuccess();

      // 刷新书籍数据以获取更新的标签
      await refreshBookData();
    }
  } catch (error) {
    console.error('Error adding tags:', error);
  }
};

// 取消标签输入
const cancelTagInput = () => {
  tagsInput.value = '';
  showTagInput.value = false;
};

// 刷新书籍数据的函数
const refreshBookData = async () => {
  if (!bookData.value) return;

  try {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api/v1';
    const apiKey = config.public.apiKey as string;

    const response: any = await $fetch(`${apiBase}/books/${bookid}?refresh=true`, {
      headers: {
        'X-API-Key': apiKey
      }
    });

    if (response.success) {
      bookData.value = response.data;
    }
  } catch (err) {
    console.error('Error refreshing book data:', err);
  }
};

// Navigation functions using Vue Router
const navigateToTag = (tag: string) => {
  router.push(`/books/list/tags/${encodeURIComponent(tag)}`);
};

const navigateToAuthor = (author: string) => {
  router.push(`/books/list/author/${encodeURIComponent(author)}`);
};

const navigateToBook = (bookid: string) => {
  router.push(`/books/${bookid}.html`);
};

// Get category label for display
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'serendipity': '意外发现',
    'similar': '相似推荐',
    'discovery': '探索发现',
    'author': '同作者',
    'tag': '同标签',
    'category': '同分类'
  };
  return labels[category] || category;
};

// Get dynamic color class based on dominant score type
const getScoreColorClass = (item: any) => {
  const similarityScore = item.similarity_score || 0;
  const discoveryScore = item.discovery_score || 0;

  // If similarity score is significantly higher (more than 1.5x discovery score)
  // Use bold, traditional colors to show strong connection
  if (similarityScore > discoveryScore * 1.5) {
    return 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white';
  }

  // If discovery score is significantly higher (more than 1.5x similarity score)
  // Use bright, encouraging colors to promote exploration
  if (discoveryScore > similarityScore * 1.5) {
    return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white dark:from-yellow-500 dark:to-orange-600 dark:text-white';
  }

  // If scores are balanced, use a neutral but positive color
  return 'bg-green-500 text-white dark:bg-green-600 dark:text-white';
};
</script>

<style>
/* 淡入淡出动画 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>