<template>
    <footer class="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div class="container mx-auto w-full p-4 py-6 lg:py-8">
            <div class="md:flex md:justify-between">
                <div class="mb-6 md:mb-0 md:w-1/3">
                    <a href="/" class="flex items-center">
                        <img src="/images/logo.svg" class="h-12 me-3" alt="任氏有无轩Logo" />
                        <span
                            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">任氏有无轩</span>
                    </a>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">任氏有无轩，成立于1989年。两任主人对各阶段设立过程进行了记录。详见<a href="https://rsywx.com/rsywxmmj">《任氏有无轩铭名记》</a>，<a href="https://rsywx.com/rsywxmmj2">《二记》</a>，<a href="https://rsywx.com/rsywxmmj3">《三记》</a>，<a href="https://rsywx.com/rsywxmmj4">《四记》</a>诸篇。</p>
                    <!-- 显示模式切换按钮 -->
                    <button @click="toggleDarkMode" class="mt-3 inline-flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <span class="sr-only">切换显示模式</span>
                        <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </button>
                </div>
                <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                    <div>
                        <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">开发框架</h2>
                        <ul class="text-gray-500 dark:text-gray-400 font-medium">
                            <li class="mb-1">
                                <a href="https://nuxt.com/" class="hover:underline">Nuxt</a>
                            </li>
                            <li class="mb-1">
                                <a href="https://tailwindcss.com/" class="hover:underline">Tailwind CSS</a>
                            </li>
                            <li>
                                <a href="https://flowbite.com/" class="hover:underline">Flowbite</a>
                            </li>

                        </ul>
                    </div>
                    <div>
                        <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">项目代码</h2>
                        <ul class="text-gray-500 dark:text-gray-400 font-medium">
                            <li class="mb-4">
                                <a href="https://github.com/taylorren/rsywx.nuxt.flowbite"
                                    class="hover:underline ">Github</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">家庭成员</h2>
                        <div class="flex">
                            <img src="/images/tr.png" alt="老彼得爸" title="老彼得爸" class="w-16 h-16 rounded-full me-2">
                            <img src="/images/gr.png" alt="老彼得妈" title="老彼得妈" class="w-16 h-16 rounded-full me-2">
                            <img src="/images/pr.jpg" alt="老彼得" title="老彼得" class="w-16 h-16 rounded-full me-2">
                            <img src="/images/rt.png" alt="Raphael the Tortoise" title="Raphael the Tortoise" class="w-16 h-16 rounded-full me-2">

                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div class="sm:flex sm:items-center sm:justify-between">
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"><a href="https://rsywx.net">任氏有无轩</a> © 1989 - {{ currentYear }} by <a href="/contact">TR@SOE</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a>
                    <div class="flex"><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nd.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;">
                    </div>
                </span>
                <div class="flex mt-4 sm:justify-center sm:mt-0">
                    <a href="https://www.facebook.com/taylor.ren" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 8 19">
                            <path fill-rule="evenodd"
                                d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Facebook</span>
                    </a>
                    <a href="https://x.com/taylorren" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 20 17">
                            <path fill-rule="evenodd"
                                d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Twitter</span>
                    </a>
                    <a href="https://github.com/taylorren" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">GitHub</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>

</template>

<script setup>
    import { ref, onMounted } from 'vue';
    
    const currentYear = new Date().getFullYear();
    
    // 暗黑模式切换功能
    const isDarkMode = ref(false);
    
    // 在组件挂载时检查本地存储和系统偏好
    onMounted(() => {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // 如果有保存的主题设置，使用它
            isDarkMode.value = savedTheme === 'dark';
        } else {
            // 否则检查系统偏好
            isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        // 应用当前主题
        applyTheme();
    });
    
    // 切换暗黑模式
    function toggleDarkMode() {
        isDarkMode.value = !isDarkMode.value;
        applyTheme();
    }
    
    // 应用主题到HTML元素
    function applyTheme() {
        if (isDarkMode.value) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
</script>