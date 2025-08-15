<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
    <div>
      <h2 class="text-xl font-semibold mb-2 flex items-center dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        &nbsp;&nbsp;今日藏书
      </h2>
      <!-- 日期图片部分 - 使用CSS生成 -->
      <div class="rounded-t-lg mb-4 flex items-center justify-center h-[150px] text-white font-bold text-center"
        :style="{ backgroundColor: randomColor }">
        <div class="text-white text-4xl font-bold">{{ formattedDate }}</div>
      </div>
      <!-- 列表部分 -->
      <div ref="bookListContainer" class="max-h-[300px] overflow-y-auto">
        <!-- 空状态 -->
        <div v-if="!todayBooks || todayBooks.length === 0" class="empty-state text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 18.75 9v7.5M9 12.75h6m-6 3h6" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">
            历史上的今天
          </p>
          <p class="text-gray-600 dark:text-gray-300 font-medium text-lg">
          没有收藏任何书籍
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
            现在收藏一本？
          </p>
        </div>

        <!-- 书籍列表 -->
        <ul v-else class="list-none p-0 dark:text-gray-300">
          <li v-for="(book, index) in displayedBooks" :key="index" class="mb-3 flex items-start">
            <!-- 书籍图标 -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 mt-1 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <!-- 书籍信息 -->
            <div class="flex-1">
              <a :href="`/books/${book.bookid}.html`"
                class="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                《{{ book.title }}》
              </a>
              <div class="ml-1 text-sm text-gray-600 dark:text-gray-400">
                <div>收藏于
                  <span
                    class="inline-flex items-center rounded-full bg-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-600 dark:text-emerald-100 cursor-pointer"
                    :title="formatDate(book.purchdate)">
                    {{ calculateYearsAgo(book.purchdate) }}
                  </span>
                  年前，位置是
                  <span
                    class="inline-flex items-center rounded-full bg-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-600 dark:text-emerald-100">
                    {{ book.location || '未知' }}
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 浏览全部按钮，仅在书籍数量超过显示限制时显示 -->
    <a v-if="showViewAllButton && todayBooks && todayBooks.length > 0" href="/books/today"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-start mt-2">
      浏览全部
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { TodayBook } from '~/types/book';
import { formatDate } from '~/utils/helper';

const props = defineProps({
  todayBooks: {
    type: Array as () => TodayBook[],
    required: true,
    default: () => []
  }
});

// 生成随机背景色
const randomColor = computed(() => {
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
});

// 格式化当前日期为 MM/DD 格式
const formattedDate = computed(() => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${month}/${day}`;
});

// 计算收藏年份（几年）
const calculateYearsAgo = (purchdate: string): number => {
  if (!purchdate) return 0;

  const purchaseDate = new Date(purchdate);
  const currentDate = new Date();

  // 计算年份差异
  let yearsAgo = currentDate.getFullYear() - purchaseDate.getFullYear();

  // 检查月份和日期，如果当前日期早于购买日期的月/日，则减去1年
  if (
    currentDate.getMonth() < purchaseDate.getMonth() ||
    (currentDate.getMonth() === purchaseDate.getMonth() &&
      currentDate.getDate() < purchaseDate.getDate())
  ) {
    yearsAgo--;
  }

  return Math.max(0, yearsAgo); // 确保不返回负数
};

// formatPurchaseDate 函数已移至 utils/helper.ts 中的 formatDate 函数

// 用于计算高度和控制显示的变量
const bookListContainer = ref<HTMLElement | null>(null);
const maxVisibleBooks = ref(5); // 默认最多显示5本书
const showViewAllButton = ref(false);

// 根据容器高度计算应该显示的书籍数量
const calculateVisibleBooks = () => {
  if (!bookListContainer.value) return;

  // 如果没有书籍数据，不显示"浏览全部"按钮
  if (!props.todayBooks || props.todayBooks.length === 0) {
    showViewAllButton.value = false;
    return;
  }

  // 假设每个列表项的高度约为24px，加上margin-bottom 8px，总共32px
  // 由于我们现在为每本书显示更多信息，每个项目的高度会更大
  const itemHeight = 80; // 调整为更大的高度
  const containerHeight = 300; // 增加容器高度以适应更多内容

  // 计算可以显示的最大数量
  const calculatedMax = Math.floor(containerHeight / itemHeight);
  maxVisibleBooks.value = Math.max(3, calculatedMax); // 至少显示3本

  // 如果书籍总数超过可显示的最大数量，则显示"浏览全部"按钮
  showViewAllButton.value = props.todayBooks.length > maxVisibleBooks.value;
};

// 计算实际显示的书籍列表
const displayedBooks = computed(() => {
  if (!props.todayBooks || props.todayBooks.length === 0) {
    return [];
  }
  if (showViewAllButton.value) {
    return props.todayBooks.slice(0, maxVisibleBooks.value);
  }
  return props.todayBooks;
});

// 在组件挂载后和todayBooks变化时计算可见书籍数量
onMounted(calculateVisibleBooks);
watch(() => props.todayBooks, calculateVisibleBooks, { immediate: true });
</script>

