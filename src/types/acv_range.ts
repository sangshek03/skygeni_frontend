export interface AcvRangeDataPoint {
  range: string;
  total_acv: number;
}

export interface AcvRangeChartResponse {
  data: {
    acv_range_id: number;
    count: number;
    acv: number;
    closed_fiscal_quarter: string;
    range: string;
    avg_deal_size?: number;
  }[];
  metadata: {
    quarters: string[];
    ranges: string[];
    totalRecords: number;
  };
}