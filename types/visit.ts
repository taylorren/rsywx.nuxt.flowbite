// filepath: types/visit.ts

/**
 * 表示单日访问统计数据 (旧格式，保持兼容性)
 */
export interface VisitStats {
  /**
   * 访问计数 (visit count)
   */
  vc: number;

  /**
   * 访问日期 (visit date)
   */
  vd: string;
}

/**
 * 新的访问历史数据格式 (来自 /books/visit_history API)
 */
export interface VisitHistoryItem {
  /**
   * 日期 (YYYY-MM-DD 格式)
   */
  date: string;

  /**
   * 访问次数
   */
  visit_count: number;

  /**
   * 星期几
   */
  day_of_week: string;
}

/**
 * 访问历史API响应格式
 */
export interface VisitHistoryResponse {
  success: boolean;
  data: VisitHistoryItem[];
  cached: boolean;
  period_info: {
    start_date: string;
    end_date: string;
    total_days: number;
    total_visits: number;
  };
}

/**
 * 表示最多30天的访问统计数据数组 (保持向后兼容)
 */
export type VisitStatsArray = VisitStats[];