<template>
  <div class="container mx-auto px-4 py-8">
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
          <h1 class="text-3xl font-bold mb-4 dark:text-white">{{ bookData.book.title }}</h1>
          
          <div class="mb-6">
            <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">作者</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.author }}</td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">分类</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.category }}</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">出版社</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.pu_name }}</td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">出版地</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.pu_place }}</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">出版日期</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.pubdate }}</td>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">ISBN</td>
                    <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.isbn }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- 标签 -->
          <div class="mb-6" v-if="bookData.tags && bookData.tags.length > 0">
            <h2 class="text-xl font-semibold mb-2 dark:text-white">标签</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(tag, index) in bookData.tags" 
                :key="index"
                class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                {{ tag }}
              </span>
              <button 
                @click="showTagModal = true" 
                class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
                title="添加标签"
              >
                +
              </button>
            </div>
            <!-- 成功消息 -->
            <div v-if="showSuccessMessage" class="mt-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded animate-fade-in-out dark:bg-green-900 dark:text-green-200">
              标签已成功添加
            </div>
          </div>
          
          <!-- 如果没有标签，仍然显示添加标签按钮 -->
          <div class="mb-6" v-else>
            <h2 class="text-xl font-semibold mb-2 dark:text-white">标签</h2>
            <div class="flex flex-wrap gap-2">
              <p class="text-gray-500 dark:text-gray-400 text-sm mr-2 flex items-center">暂无标签</p>
              <button 
                @click="showTagModal = true" 
                class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
                title="添加标签"
              >
                +
              </button>
            </div>
            <!-- 成功消息 -->
            <div v-if="showSuccessMessage" class="mt-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded animate-fade-in-out dark:bg-green-900 dark:text-green-200">
              标签已成功添加
            </div>
          </div>
          
          <!-- 简介 -->
          <div class="mb-6" v-if="bookData.book.intro">
            <h2 class="text-xl font-semibold mb-2 dark:text-white">简介</h2>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <p class="whitespace-pre-line dark:text-gray-200">{{ bookData.book.intro }}</p>
            </div>
          </div>
          
          <!-- 评论 -->
          <div v-if="bookData.book.reviews && bookData.book.reviews.length > 0">
            <h2 class="text-xl font-semibold mb-2 dark:text-white">评论</h2>
            <div class="space-y-4">
              <div 
                v-for="(review, index) in bookData.book.reviews" 
                :key="index"
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded flex gap-4"
              >
                <div class="flex-shrink-0 w-24 h-24">
                  <img 
                    :src="review.bt || 'https://rsywx.net/assets/img/default.jpg'"
                    alt="评论配图" 
                    class="w-full h-full object-cover rounded"
                  />
                </div>
                <div class="flex-grow">
                  <p class="whitespace-pre-line dark:text-gray-200">{{ review.rt }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">创作于{{ review.datein }}</p>
                  <a 
                    v-if="review.uri" 
                    :href="review.uri" 
                    target="_blank" 
                    class="text-blue-500 hover:underline text-sm dark:text-blue-400"
                  >
                    查看原文
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧收藏信息 -->
        <div class="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg h-fit">
          <!-- 书籍封面 -->
          <div class="mb-6 flex justify-center">
            <img 
              :src="`https://api.rsywx.com/covers/${bookid}.jpg`" 
              :alt="bookData.book.title + ' 封面'" 
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
          
          <h2 class="text-xl font-semibold mb-4 dark:text-white">收藏信息</h2>
          <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr class="bg-white dark:bg-gray-800">
                  <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/3">购买日期</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.purchdate }}</td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-700">
                  <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/3">价格</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.price }}</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/3">位置</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.location }}</td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-700">
                  <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/3">访问次数</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ formatNumber(bookData.book.vc) }}</td>
                </tr>
                <tr class="bg-white dark:bg-gray-800">
                  <td class="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/3">最后访问</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-gray-200">{{ bookData.book.lvt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 添加标签模态框 -->
  <Teleport to="body">
    <div v-if="showTagModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-dialog max-w-md w-full mx-4"> 
        <div class="modal-content border-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl"> 
          <div class="position-relative border-0 pe-4 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"> 
            <h3 class="text-lg font-semibold dark:text-white">标记感兴趣的书</h3>
            <button type="button" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" @click="showTagModal = false" aria-label="Close"> 
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button> 
          </div> 
          <div class="p-5"> 
            <p class="mb-4 text-gray-600 dark:text-gray-400">增加自己的TAG</p>
            <form @submit.prevent="submitTags" class="space-y-4"> 
              <div class="relative"> 
                <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"> 
                  <span class="pl-3 text-gray-500 dark:text-gray-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                  </span> 
                  <input 
                    v-model="tagsInput" 
                    class="w-full px-3 py-2 outline-none bg-transparent dark:text-white" 
                    autofocus 
                    placeholder="（用空格分割）" 
                    name="tags" 
                    id="tags"
                  > 
                </div> 
              </div> 
              <input type="hidden" name="id" :value="bookData?.book.id"/> 
              <input type="hidden" name="bookid" :value="bookData?.book.bookid"/> 
              <div> 
                <button 
                  class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition duration-200" 
                  type="submit"
                > 
                  添加 
                </button> 
              </div> 
            </form> 
          </div> 
        </div> 
      </div> 
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAsyncData } from 'nuxt/app';
import { BookService } from '~/services/bookService';
import { formatNumber } from '~/utils/helper';
import type { Book, BookTags } from '~/types/book';

const route = useRoute();
const bookid = route.params.bookid;
const loading = ref(true);
const error = ref<Error | null>(null);
const bookData = ref<{ book: Book; tags: BookTags } | null>(null);
const showCover = ref(true);

// 处理图片加载错误
const handleImageError = () => {
  showCover.value = false;
};

// 创建BookService实例
const bookService = new BookService($fetch);

// 获取书籍详情和标签
try {
  const { data, error: asyncError } = await useAsyncData(`book-${bookid}`, async () => {
    // 确保 bookid 是字符串类型
    return await bookService.getBookByBookid(String(bookid));
  });
  
  if (asyncError.value) {
    error.value = asyncError.value;
  } else {
    bookData.value = data.value;
  }
} catch (e) {
  error.value = e instanceof Error ? e : new Error(String(e));
} finally {
  loading.value = false;
}

const showTagModal = ref(false);
const tagsInput = ref('');
const showSuccessMessage = ref(false);

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
  
  // 先清空输入并关闭模态框，让用户立即看到反馈
  const inputTags = tagsInput.value;
  tagsInput.value = '';
  showTagModal.value = false;
  
  // 显示成功消息
  showSuccess();
  
  try {
    // 创建表单数据
    const formData = new FormData();
    formData.append('tags', inputTags);
    formData.append('id', bookData.value.book.id.toString());
    formData.append('bookid', bookData.value.book.bookid);
    
    // 发送POST请求
    const response = await fetch('https://rsywx.net/books/add_tags', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      // 然后在后台刷新标签数据
      const { data } = await useAsyncData(`book-tags-${bookid}`, async () => {
        return await bookService.getTagsByBookid(String(bookid));
      }, { server: false });
      
      if (data.value && bookData.value) {
        bookData.value.tags = data.value;
      }
    } else {
      console.error('Failed to add tags');
      // 即使请求失败，也尝试刷新标签数据
      refreshTagData();
    }
  } catch (error) {
    console.error('Error adding tags:', error);
    // 即使出现错误，也尝试刷新标签数据
    refreshTagData();
  }
};

// 刷新标签数据的函数
const refreshTagData = async () => {
  if (!bookData.value) return;
  
  try {
    const { data } = await useAsyncData(`book-tags-${bookid}`, async () => {
      return await bookService.getTagsByBookid(String(bookid));
    }, { server: false });
    
    if (data.value && bookData.value) {
      bookData.value.tags = data.value;
    }
  } catch (err) {
    console.error('Error refreshing tag data:', err);
  }
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