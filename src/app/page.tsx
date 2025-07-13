import WaterfallChart from '@/components/charts/water_fall_chart'

export default async function DashboardPage() {
    const waterFallData = await getWaterfallData()

    return (
        <div>
            <div >
                Please Select Any Tab form Header to see more Data
            </div>
            <WaterfallChart data={waterFallData} />
        </div>
    )
}

async function getWaterfallData(): Promise<any> {
    try {
        const res = await fetch(
            'http://localhost:3001/api/v1/analytics/acv-range/waterfall'
        )

        if (!res.ok) {
            throw new Error('Failed to fetch waterfall data')
        }

        const data = await res.json()
        return data.data ?? []
    } catch (error) {
        console.error('Error fetching waterfall data:', error)
        return []
    }
}
