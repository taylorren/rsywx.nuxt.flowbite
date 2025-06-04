<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full col-span-2">
    <div>
      <h2 class="text-xl font-semibold mb-2 flex items-center dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        &nbsp;&nbsp;访问统计
      </h2>
      <div class="chart-container" style="position: relative; height: 300px; width: 100%;">
        <client-only>
          <LineChart :data="chartData" :options="chartOptions" />
        </client-only>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">今日访问</div>
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
            {{ formatNumber(todayVisits) }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">昨日访问</div>
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
            {{ formatNumber(yesterdayVisits) }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">30天总访问</div>
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
            {{ formatNumber(totalVisits) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { VisitStatsArray } from '~/types/visit';
import { visitService } from '~/services/visitService';
import { formatNumber } from '~/utils/helper';

// 定义组件属性
const props = defineProps<{
  visitStats: VisitStatsArray | null | undefined;
}>();

// 访问数据状态
const visitData = ref<VisitStatsArray>([]);
const isLoading = ref(true);

// 计算属性：今日访问量
const todayVisits = computed(() => {
  if (!visitData.value || visitData.value.length === 0) return 0;
  return visitData.value[0].vc;
});

// 计算属性：昨日访问量
const yesterdayVisits = computed(() => {
  if (!visitData.value || visitData.value.length < 2) return 0;
  return visitData.value[1].vc;
});

// 计算属性：30天总访问量
const totalVisits = computed(() => {
  if (!visitData.value || visitData.value.length === 0) return 0;
  return visitData.value.reduce((sum, item) => sum + item.vc, 0);
});

// 图表数据
const chartData = computed(() => {
  // 确保visitData.value存在且有数据
  if (!visitData.value || visitData.value.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: '每日访问量',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        data: []
      }]
    };
  }
  
  // 不再反转数据，保持日期从左到右是从早到晚
  const labels = visitData.value.map(item => formatDate(item.vd));
  const visitCounts = visitData.value.map(item => item.vc);
  
  return {
    labels,
    datasets: [
      {
        label: '每日访问量',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        data: visitCounts
      }
    ]
  };
});

// 图表配置
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)'
      },
      ticks: {
        color: '#718096'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#718096',
        maxRotation: 45,
        minRotation: 45
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#718096'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 1
    }
  }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 组件挂载时获取数据
onMounted(async () => {
  // 如果props中已经有数据，则优先使用props数据
  if (props.visitStats && props.visitStats.length > 0) {
    visitData.value = props.visitStats;
    isLoading.value = false;
    return;
  }
  
  // 否则从服务获取数据
  try {
    const data = await visitService.getVisitStats();
    visitData.value = data;
  } catch (error) {
    console.error('获取访问统计数据失败:', error);
  } finally {
    isLoading.value = false;
    console.log(visitData.value);
  }
});
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2 / span 2;
}
</style>