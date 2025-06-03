// composables/useFlowbite.js
import { useRuntimeConfig } from '#app';

export function useFlowbite(callback) {
  // 检查是否在客户端环境
  if (typeof window !== 'undefined') {
    return import('flowbite').then((flowbite) => {
      if (typeof callback === 'function') {
        callback(flowbite);
      }
      return flowbite;
    });
  }
  return Promise.resolve(null);
}
