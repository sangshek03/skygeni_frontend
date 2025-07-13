"use client"
import HeatmapChart from '@/components/charts/heat_map_chart'
import WaterfallChart from '@/components/charts/water_fall_chart'
import { Button, Card, CardContent } from '@mui/material'
import { useEffect, useState } from 'react'

export default function AcvRangeDashboard() {
    const [waterfallData, setWaterfallData] = useState([])
    const [heatmapData, setHeatmapData] = useState({
        metadata: { ranges: [], quarters: [] },
        data: [],
    })
    const [normalizeBy, setNormalizeBy] = useState<'acv' | 'count'>('acv')
    const [isLoading, setIsLoading] = useState(true)

    const fetchWaterfall = async () => {
        try {
            const response = await fetch(
                'http://localhost:3001/api/v1/analytics/acv-range/waterfall'
            )
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            console.log(data)
            setWaterfallData(data.data)
        } catch (err) {
            console.error('Error fetching waterfall data', err)
        }
    }

    const fetchHeatmap = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/v1/analytics/acv-range/heatmap?normalize=${normalizeBy}`
            )
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setHeatmapData(data)
        } catch (err) {
            console.error('Error fetching heatmap data', err)
        }
    }

    useEffect(() => {
        fetchWaterfall()
    }, [])

    useEffect(() => {
        fetchHeatmap()
    }, [normalizeBy])

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">ACV Range Dashboard</h1>

            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Waterfall Chart
                    </h2>
                    {waterfallData.length > 0 ? (

                        <WaterfallChart data={waterfallData} />
                    ) : (
                        <p className="text-gray-500">
                            No data available for Waterfall chart.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Heatmap Chart</h2>
                        <div className="space-x-2">
                            <Button
                                variant={
                                    normalizeBy === 'acv'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setNormalizeBy('acv')}
                            >
                                Normalize by ACV
                            </Button>
                            <Button
                                variant={
                                    normalizeBy === 'count'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setNormalizeBy('count')}
                            >
                                Normalize by Count
                            </Button>
                        </div>
                    </div>
                    {heatmapData?.metadata?.ranges?.length > 0 ? (
                        <HeatmapChart
                            data={heatmapData.data}
                            normalize={normalizeBy}
                            quarters={heatmapData.metadata.quarters}
                            ranges={heatmapData.metadata.ranges}
                        />
                    ) : (
                        <p className="text-gray-500">
                            No data available for Heatmap chart.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
