import { AcvRangeChartResponse } from "@/types/acv_range";


export const fetchAcvRangeData = async (): Promise<AcvRangeChartResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/acv-range`);
  if (!res.ok) throw new Error('Failed to fetch ACV Range data');
  return res.json();
};