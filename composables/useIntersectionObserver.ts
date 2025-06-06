// composables/useIntersectionObserver.ts
import { onMounted, onUnmounted, ref } from 'vue';

type IntersectionCallback = () => void;

interface ObserverTarget {
  element: HTMLElement;
  callback: IntersectionCallback;
  loaded: boolean;
}

interface UseIntersectionObserverOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * 提供Intersection Observer相关功能的组合式API
 * 用于管理基于视口可见性的延迟加载
 * @param options Intersection Observer的配置选项
 * @returns 用于管理观察目标的方法
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const targets = ref<Map<HTMLElement, ObserverTarget>>(new Map());
  let observer: IntersectionObserver | null = null;
  
  // 创建Intersection Observer实例
  const createObserver = () => {
    const defaultOptions = {
      root: null, // 使用视口作为根
      rootMargin: '0px', // 无边距
      threshold: 0.1 // 当10%的元素可见时触发
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = targets.value.get(entry.target as HTMLElement);
          
          if (target && !target.loaded) {
            // 执行回调
            target.callback();
            target.loaded = true;
            
            // 取消观察
            observer?.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);
    
    return observer;
  };
  
  // 添加观察目标
  const observe = (element: HTMLElement | null, callback: IntersectionCallback) => {
    if (!element) return;
    
    // 确保observer已创建
    if (!observer) {
      observer = createObserver();
    }
    
    // 添加到目标列表
    targets.value.set(element, {
      element,
      callback,
      loaded: false
    });
    
    // 开始观察
    observer.observe(element);
  };
  
  // 取消观察目标
  const unobserve = (element: HTMLElement | null) => {
    if (!element || !observer) return;
    
    observer.unobserve(element);
    targets.value.delete(element);
  };
  
  // 取消观察所有目标
  const disconnect = () => {
    if (!observer) return;
    
    observer.disconnect();
    targets.value.clear();
  };
  
  // 组件卸载时清理
  onUnmounted(() => {
    disconnect();
  });
  
  return {
    observe,
    unobserve,
    disconnect
  };
}