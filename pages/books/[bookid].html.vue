<template>
  <div class="container mx-auto px-4 py-8" :key="route.params.bookid">
    <div v-if="loading" class="flex justify-center items-center h-64">
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
                        <span class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">
                          {{ bookData.region }}
                        </span>
                        <span v-if="bookData.translated && bookData.copyrighter">
                          <button @click="navigateToAuthor(bookData.author)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                            {{ bookData.author }}
                          </button>
                          | {{ bookData.copyrighter }}
                        </span>
                        <span v-else>
                          <button @click="navigateToAuthor(bookData.author)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                            {{ bookData.author }}
                          </button>
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">分类</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs">
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
                      <span class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs">
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
              <button 
                v-for="(tag, index) in bookData.tags" 
                :key="index"
                @click="navigateToTag(tag)"
                class="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-700 transition-colors cursor-pointer"
              >
                {{ tag }}
              </button>
              <button 
                v-if="!showTagInput"
                @click="showTagInput = true" 
                class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
                title="添加标签"
              >
                +
              </button>
            </div>
            
            <!-- 内联标签输入 -->
            <div v-if="showTagInput" class="flex gap-2 items-center">
              <input 
                v-model="tagsInput"
                @keyup.enter="submitTags"
                @keyup.escape="cancelTagInput"
                ref="tagInputRef"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入标签，用空格分隔，按回车确认"
                autofocus
              />
              <button 
                @click="submitTags"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
              >
                添加
              </button>
              <button 
                @click="cancelTagInput"
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm"
              >
                取消
              </button>
            </div>
            
            <!-- 成功消息 -->
            <div v-if="showSuccessMessage" class="mt-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded animate-fade-in-out dark:bg-green-900 dark:text-green-200">
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
          <div v-if="bookData.reviews && bookData.reviews.length > 0">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">相关评论</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(review, index) in bookData.reviews" 
                :key="index"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <!-- Feature image at top -->
                <div class="aspect-video w-full">
                  <img 
                    :src="review.feature || '/covers/' + bookData.bookid + '.webp'"
                    :alt="review.title" 
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- Review content -->
                <div class="p-4">
                  <a 
                    :href="review.uri" 
                    target="_blank" 
                    class="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 block mb-2"
                  >
                    {{ review.title }}
                  </a>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ review.datein }}
                  </p>
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
              <img 
                :src="`/covers/${bookid}.webp`" 
                :alt="bookData.title + ' 封面'" 
                class="max-w-full h-auto rounded shadow-md border border-gray-200 dark:border-gray-700"
                @error="handleImageError"
                v-if="showCover"
              />
              <div 
                v-else 
                class="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
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
                      <span class="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium">
                        ¥{{ bookData.price }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">存放位置</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">
                      <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs">
                        {{ bookData.location }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/2">访问次数</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ formatNumber(bookData.total_visits) }}</td>
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

const route = useRoute();
const router = useRouter();
const bookid = route.params.bookid;
const loading = ref(true);
const error = ref<Error | null>(null);
const bookData = ref<any>(null);
const showCover = ref(true);

// 处理图片加载错误
const handleImageError = () => {
  showCover.value = false;
};

// 获取书籍详情
const fetchBookData = async () => {
  try {
    const config = useRuntimeConfig();
    const response: any = await $fetch(`${config.public.apiBase}/books/${bookid}`, {
      headers: {
        'X-API-Key': config.public.apiKey
      }
    });
    
    if (response.success) {
      bookData.value = response.data;
    } else {
      error.value = new Error('Failed to load book details');
    }
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookData();
});

// Watch for route changes to handle browser back navigation
watch(() => route.params.bookid, (newBookId, oldBookId) => {
  if (newBookId && newBookId !== oldBookId) {
    // Reset state
    loading.value = true;
    error.value = null;
    bookData.value = null;
    showCover.value = true;
    showTagInput.value = false;
    tagsInput.value = '';
    showSuccessMessage.value = false;
    // Fetch new data
    fetchBookData();
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
</script>

<style>
/* 淡入淡出动画 */
@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}

.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out;
}
</style>