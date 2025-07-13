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

// Account Industry Types
export interface AccountIndustryDataPoint {
  acct_industry_id: number;
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  acct_industry: string;
  query_key: string;
  avg_deal_size?: number;
}

export interface AccountIndustryChartResponse {
  data: AccountIndustryDataPoint[];
  metadata: {
    quarters: string[];
    industries: string[];
    totalRecords: number;
  };
}

// Customer Type Types
export interface CustomerTypeDataPoint {
  customer_type_id: number;
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  type: 'New Customer' | 'Existing Customer';
  acv_per_deal?: number;
}

export interface CustomerTypeChartResponse {
  data: CustomerTypeDataPoint[];
  metadata: {
    quarters: string[];
    total_acv: number;
    new_customer_ratio: number;
  };
}

// Team Performance Types
export interface TeamDataPoint {
  team_id: number;
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  name: string;
  avg_deal_size?: number;
}

export interface TeamChartResponse {
  data: TeamDataPoint[];
  metadata: {
    quarters: string[];
    teams: string[];
    total_acv: number;
  };
}

// Combined Dashboard Types
export interface DashboardData {
  industryData: AccountIndustryChartResponse;
  customerData: {
    segments: {
      type: string;
      percentage: number;
      count: number;
      acv: number;
    }[];
    sparkline: {
      quarter: string;
      newCustomers: number;
    }[];
  };
  teamData: TeamDataPoint[];
}