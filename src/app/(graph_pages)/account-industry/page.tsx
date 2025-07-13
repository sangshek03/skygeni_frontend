// pages/dashboard/account-industry.tsx
'use client';
import AccountIndustryPieChart from '@/components/charts/account_pie_chart';
import AccountIndustryStackedBar from '@/components/charts/stacked_bar_chart';
import DataCard from '@/components/dashboard_components/data_card';
import { useEffect, useState } from 'react';


const years = ['2023', '2024'];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function AccountIndustryDashboard() {
  const [stackedBarData, setStackedBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');

  const fetchPieData = async (year: string, quarter: string) => {
    const url = `http://localhost:3001/api/v1/analytics/account-industry/pie-chart?quarter=${year}-${quarter}`;
    const res = await fetch(url);
    const json = await res.json();
    setPieData(json.data || []);
  };

  useEffect(() => {
    // Stacked bar chart fetch
    fetch(
      'http://localhost:3001/api/v1/analytics/account-industry/stacked-bar'
    )
      .then((res) => res.json())
      .then((data) => setStackedBarData(data.data));

    // Initial pie chart fetch
    fetchPieData(selectedYear, selectedQuarter);
  }, []);

  useEffect(() => {
    fetchPieData(selectedYear, selectedQuarter);
  }, [selectedYear, selectedQuarter]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Account Industry Analytics</h1>

      <DataCard title="Stacked Bar Chart by Quarter">
        <AccountIndustryStackedBar data={stackedBarData} />
      </DataCard>

      <DataCard title="Industry Contribution Pie Chart">
        <div className="flex gap-4 mb-4">
          <select
            className="border px-3 py-2 rounded bg-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className="border px-3 py-2 rounded bg-white"
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
          >
            {quarters.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <AccountIndustryPieChart data={pieData} />
      </DataCard>
    </div>
  );
}
