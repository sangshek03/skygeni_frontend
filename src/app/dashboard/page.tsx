import { WaterfallChart } from '@/components/charts/water_fall_chart';
import { QuarterSelector } from '@/components/filters/quarter_selector';
import { fetchAcvRangeData } from '@/lib/api/acv_range';
import { Grid } from '@mui/material';


export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { quarter?: string }
}) {
  const selectedQuarter = searchParams.quarter || '2024-Q1';
  const acvRangeData = await fetchAcvRangeData(selectedQuarter);

  // Filter data for selected quarter
  const filteredData = acvRangeData.data.filter(
    item => item.closed_fiscal_quarter === selectedQuarter
  );

  return (
    <div className="p-6">
      <div>

      <QuarterSelector currentQuarter={selectedQuarter} />
      </div>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <WaterfallChart 
            data={filteredData.map(d => ({
              range: d.range,
              total_acv: d.acv
            }))} 
          />
        </Grid>
      </Grid>
    </div>
  );
}