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