// filepath: types/visit.ts

/**
 * 表示单日访问统计数据
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
 * 表示最多30天的访问统计数据数组
 */
export type VisitStatsArray = VisitStats[];