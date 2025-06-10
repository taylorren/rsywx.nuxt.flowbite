/**
 * 辅助工具函数集合
 */

/**
 * 格式化数字，添加千分位分隔符
 * @param num 要格式化的数字或字符串
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化日期为 YYYY年MM月DD日 格式
 * @param dateStr 要格式化的日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '未知日期';
  
  try {
    const date = new Date(dateStr);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '日期格式无效';
    }
    
    // 格式化为 YYYY年MM月DD日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}年${month}月${day}日`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '日期格式错误';
  }
}