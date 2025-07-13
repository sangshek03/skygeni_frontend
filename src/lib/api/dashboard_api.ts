import { AccountIndustryChartResponse, AcvRangeChartResponse, CustomerTypeChartResponse, TeamChartResponse } from "@/types/dashboard_types";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export const fetchAcvRangeData = async (): Promise<AcvRangeChartResponse> => {
  const res = await fetch(`${API_BASE_URL}/analytics/acv-range`, {
    next: { revalidate: 3600 } // ISR: Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ACV Range data: ${res.statusText}`);
  }

  return await res.json();
};

/**
 * Fetches account industry data for a specific quarter
 * @param quarter Fiscal quarter in 'YYYY-QX' format
 */
export const fetchAccountIndustryData = async (
  quarter?: string
): Promise<AccountIndustryChartResponse> => {
  const url = new URL(`${API_BASE_URL}/analytics/account-industry`);
  if (quarter) url.searchParams.append('quarter', quarter);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch account industry data: ${res.statusText}`);
  }

  return res.json();
};

/**
 * Fetches customer type distribution data
 * @param quarter Fiscal quarter in 'YYYY-QX' format
 */
export const fetchCustomerTypeData = async (
  quarter?: string
): Promise<{
  segments: { type: string; percentage: number; count: number; acv: number }[];
  sparkline: { quarter: string; newCustomers: number }[];
}> => {
  const url = new URL(`${API_BASE_URL}/analytics/customer-type`);
  if (quarter) url.searchParams.append('quarter', quarter);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch customer type data: ${res.statusText}`);
  }

  const data: CustomerTypeChartResponse = await res.json();

  // Transform data for donut chart
  const totalAcv = data.data.reduce((sum, item) => sum + item.acv, 0);
  const segments = data.data.map(item => ({
    type: item.type,
    count: item.count,
    acv: item.acv,
    percentage: parseFloat(((item.acv / totalAcv) * 100).toFixed(1))
  }));

  // Prepare sparkline data (new customers trend)
  const sparkline = data.metadata.quarters.map(q => {
    const quarterData = data.data.filter(d => d.closed_fiscal_quarter === q);
    const newCustomers = quarterData.find(d => d.type === 'New Customer')?.count || 0;
    return { quarter: q, newCustomers };
  });

  return { segments, sparkline };
};

/**
 * Fetches team performance data
 * @param quarter Fiscal quarter in 'YYYY-QX' format
 */
export const fetchTeamData = async (
  quarter?: string
): Promise<TeamChartResponse['data']> => {
  const url = new URL(`${API_BASE_URL}/analytics/team`);
  if (quarter) url.searchParams.append('quarter', quarter);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch team data: ${res.statusText}`);
  }

  const data: TeamChartResponse = await res.json();
  return data.data;
};

/**
 * Fetches all dashboard data in parallel
 */
export const fetchDashboardData = async (quarter?: string) => {
  return Promise.all([
    fetchAccountIndustryData(quarter),
    fetchCustomerTypeData(quarter),
    fetchTeamData(quarter)
  ]);
};