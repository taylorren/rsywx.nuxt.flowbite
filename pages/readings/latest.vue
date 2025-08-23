<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold dark:text-white flex items-center gap-4">
                最新阅读评论
                <span
                    class="text-base font-normal text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
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

        <!-- Reviews Grid -->
        <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div v-for="(review, index) in reviews" :key="index"
                    class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <!-- Feature image -->
                    <div class="aspect-video w-full">
                        <img :src="review.feature || '/images/placeholder.jpg'" :alt="review.title"
                            class="w-full h-full object-cover" @error="handleImageError($event)" />
                    </div>

                    <!-- Review content -->
                    <div class="p-4">
                        <a :href="review.uri" target="_blank"
                            class="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 block mb-3">
                            {{ review.title }}
                        </a>
                        
                        <!-- Book information -->
                        <div v-if="review.book_title || review.bookid" class="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div class="flex items-center gap-2 text-sm">
                                <span class="text-gray-600 dark:text-gray-400">评论书籍：</span>
                                <a 
                                    v-if="review.bookid" 
                                    :href="`/books/${review.bookid}.html`"
                                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    《{{ review.book_title || `书号 ${review.bookid}` }}》
                                </a>
                                <span v-else class="text-gray-700 dark:text-gray-300 font-medium">
                                    {{ review.book_title }}
                                </span>
                            </div>
                        </div>
                        
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ review.datein }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="flex flex-col gap-4 mt-8">
                <div class="flex items-center justify-center gap-2">
                    <button :disabled="currentPage === 1" @click="goToPage(1)"
                        class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
                        title="跳转到第一页">
                        首页
                    </button>
                    <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)"
                        class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
                        title="跳转到上一页">
                        上一页
                    </button>
                    <div class="flex items-center gap-2 px-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-700 dark:text-gray-400">跳转到：</span>
                            <input type="number" v-model="jumpToPage" @keyup.enter="handleJumpToPage" min="1"
                                :max="totalPages"
                                class="w-16 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                            <button @click="handleJumpToPage"
                                class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800">
                                跳转
                            </button>
                        </div>
                    </div>
                    <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)"
                        class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
                        title="跳转到下一页">
                        下一页
                    </button>
                    <button :disabled="currentPage === totalPages" @click="goToPage(totalPages)"
                        class="min-w-[4rem] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-800"
                        title="跳转到最后一页">
                        末页
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const reviews = ref<any[]>([]);
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

// Get current page from route
const getCurrentPage = () => {
    const page = route.query.page;
    return page ? parseInt(page as string) : 1;
};

// Fetch latest reviews with pagination
const fetchReviews = async () => {
    pending.value = true;
    error.value = null;

    const page = getCurrentPage();
    currentPage.value = page;

    try {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase;
        const apiKey = config.public.apiKey;

        // Use the correct API endpoint: /readings/reviews/{page}
        const response: any = await $fetch(`${apiBase}/readings/reviews/${page}`, {
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (response.success) {
            reviews.value = response.data;
            // Handle pagination info if available
            if (response.pagination) {
                currentPage.value = response.pagination.current_page;
                totalPages.value = response.pagination.total_pages;
            } else {
                // If no pagination info, calculate based on data length
                const totalReviews = response.total || response.data.length;
                totalPages.value = Math.ceil(totalReviews / 9);
            }
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
    if (page === 1) {
        router.push('/readings/latest');
    } else {
        router.push(`/readings/latest?page=${page}`);
    }
};

// Handle image error
const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = '/images/placeholder.jpg';
};

// Watch for route changes
watch(() => route.query, fetchReviews, { immediate: true });
</script>