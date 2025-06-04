// plugins/chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Bar, Line } from 'vue-chartjs'

export default defineNuxtPlugin((nuxtApp) => {
  // 注册Chart.js组件
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  )

  // 注册全局组件
  nuxtApp.vueApp.component('BarChart', Bar)
  nuxtApp.vueApp.component('LineChart', Line)

  return {
    provide: {
      chart: ChartJS
    }
  }
})