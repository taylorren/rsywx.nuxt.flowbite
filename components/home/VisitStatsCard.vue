<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">
    <h2 class="text-xl font-semibold mb-4 dark:text-white">访问统计</h2>
    <client-only>
      <div v-if="chartData && chartData.datasets && chartData.datasets[0].data.length > 0" class="h-64">
        <LineChart :data="chartData" :options="chartOptions" />
      </div>
      <div v-else-if="loading" class="h-64 flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
      <div v-else class="h-64 flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">暂无数据</p>
      </div>
    </client-only>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">今日访问</p>
        <p class="text-2xl font-bold dark:text-white">{{ todayVisits }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">昨日访问</p>
        <p class="text-2xl font-bold dark:text-white">{{ yesterdayVisits }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ periodDays }}天访问</p>
        <p class="text-2xl font-bold dark:text-white">{{ totalVisits }}</p>
      </div>
    </div>

    <!-- 显示数据期间信息 (如果有新API数据) -->
    <div v-if="visitHistoryData && visitHistoryData.period_info"
      class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
      <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span class="font-medium">统计期间:</span>
          {{ formatDateRange(visitHistoryData.period_info.start_date, visitHistoryData.period_info.end_date) }}
        </div>
        <div>
          <span class="font-medium">日均访问:</span>
          {{ Math.round(visitHistoryData.period_info.total_visits / visitHistoryData.period_info.total_days) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { visitService } from '~/services/visitService';
import type { VisitStatsArray, VisitHistoryResponse } from '~/types/visit';

const props = defineProps<{
  visitStats?: VisitStatsArray | null;
}>();

const loading = ref(false);
const localVisitStats = ref<VisitStatsArray | null>(null);
const visitHistoryData = ref<VisitHistoryResponse | null>(null);

// 使用props或本地数据
const visitData = computed(() => {
  // 优先使用新的访问历史数据
  if (visitHistoryData.value && visitHistoryData.value.data.length > 0) {
    return visitHistoryData.value.data.map(item => ({
      vc: item.visit_count,
      vd: item.date
    }));
  }
  return props.visitStats || localVisitStats.value || [];
});

// 计算图表数据
const chartData = computed(() => {
  if (!visitData.value || visitData.value.length === 0) return null;

  const dates = visitData.value.map(item => formatDate(new Date(item.vd)));
  const counts = visitData.value.map(item => item.vc);

  return {
    labels: dates,
    datasets: [
      {
        label: '访问量',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        data: counts,
        fill: true,
        tension: 0,
      },
    ],
  };
});

// 图表配置
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

// 计算今日访问量
const todayVisits = computed(() => {
  if (!visitData.value || visitData.value.length === 0) return 0;
  const today = new Date().toISOString().split('T')[0];
  const todayData = visitData.value.find(item => item.vd === today);
  return todayData ? todayData.vc : 0;
});

// 计算昨日访问量
const yesterdayVisits = computed(() => {
  if (!visitData.value || visitData.value.length === 0) return 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdayData = visitData.value.find(item => item.vd === yesterdayStr);
  return yesterdayData ? yesterdayData.vc : 0;
});

// 计算30天总访问量
const totalVisits = computed(() => {
  // 优先使用新API的period_info中的total_visits
  if (visitHistoryData.value && visitHistoryData.value.period_info) {
    return visitHistoryData.value.period_info.total_visits;
  }
  // 回退到计算总和
  if (!visitData.value || visitData.value.length === 0) return 0;
  return visitData.value.reduce((sum, item) => sum + item.vc, 0);
});

// 计算统计期间天数
const periodDays = computed(() => {
  if (visitHistoryData.value && visitHistoryData.value.period_info) {
    return visitHistoryData.value.period_info.total_days;
  }
  return 30; // 默认30天
});

// 格式化日期
function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

// 格式化日期范围
function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatShort = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return `${formatShort(start)} - ${formatShort(end)}`;
}

// 加载访问统计数据
async function loadVisitStats() {
  if (props.visitStats && props.visitStats.length > 0) {
    return; // 如果已经通过props提供了数据，则不需要再次加载
  }

  loading.value = true;
  try {
    // 优先使用新的访问历史API
    visitHistoryData.value = await visitService.getVisitHistory(30);
    // console.log('✅ Visit history data loaded:', visitHistoryData.value); // Commented out for production
  } catch (error) {
    console.error('Failed to fetch visit history, falling back to legacy API:', error);
    try {
      // 回退到旧API
      localVisitStats.value = await visitService.getVisitStats();
    } catch (legacyError) {
      console.error('Failed to fetch visit stats:', legacyError);
    }
  } finally {
    loading.value = false;
  }
}

// 监听props变化
watch(() => props.visitStats, (newValue) => {
  if (newValue && newValue.length > 0) {
    // 如果props中有数据，使用props数据
    localVisitStats.value = null;
  } else if (!localVisitStats.value) {
    // 如果props中没有数据，且本地也没有数据，则加载数据
    loadVisitStats();
  }
}, { immediate: true });

onMounted(() => {
  if (!props.visitStats || props.visitStats.length === 0) {
    loadVisitStats();
  }
});
</script>