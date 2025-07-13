'use client'
import HorizontalBarChart from '@/components/charts/horizontal_bar_chart'
import RadarChart from '@/components/charts/radar_chart'
import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'

export interface HorizontalBarData {
    type: string
    teams: {
        name: string
        value: number | string
        quarter: string
    }[]
}

export interface RadarData {
    quarter: string
    metrics: {
        name: string
        count: number
        acv: string
    }[]
}
const timePeriod = ['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2']

export default function TeamDashboard() {
    const [horizontalBarData, setHorizontalBarData] = useState<
        HorizontalBarData[]
    >([])
    const [radarData, setRadarData] = useState<RadarData[]>([])
    const [isLoading, setIsLoading] = useState({
        horizontalBar: true,
        radar: true,
    })
    const [filters, setFilters] = useState({
        horizontalBarQuarter: timePeriod[0],
        radarStartQuarter: timePeriod[0],
        radarEndQuarter: timePeriod[1],
    })

    const fetchHorizontalBarData = async () => {
        setIsLoading((prev) => ({ ...prev, horizontalBar: true }))
        try {
            const response = await fetch(
                `http://localhost:3001/api/v1/analytics/team/horizontal-bar?quarter=${filters.horizontalBarQuarter}`
            )
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            setHorizontalBarData(data)
        } catch (err) {
            console.error('Error fetching horizontal bar data', err)
        } finally {
            setIsLoading((prev) => ({ ...prev, horizontalBar: false }))
        }
    }

    const fetchRadarData = async () => {
        setIsLoading((prev) => ({ ...prev, radar: true }))
        try {
            const response = await fetch(
                `http://localhost:3001/api/v1/analytics/team/radar?quarters=${filters.radarStartQuarter},${filters.radarEndQuarter}`
            )
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            setRadarData(data)
        } catch (err) {
            console.error('Error fetching radar data', err)
        } finally {
            setIsLoading((prev) => ({ ...prev, radar: false }))
        }
    }

    useEffect(() => {
        fetchHorizontalBarData()
    }, [filters.horizontalBarQuarter])

    useEffect(() => {
        fetchRadarData()
    }, [filters.radarStartQuarter, filters.radarEndQuarter])

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Team Performance Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Horizontal Bar Chart Card */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Team Performance by Quarter
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Select
                                    value={filters.horizontalBarQuarter}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'horizontalBarQuarter',
                                            e.target.value as string
                                        )
                                    }
                                    size="small"
                                >
                                    {timePeriod.map((t) => (
                                        <MenuItem key={t} value={t}>
                                            {t}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {isLoading.horizontalBar ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading...</p>
                            </div>
                        ) : horizontalBarData.length > 0 ? (
                            <HorizontalBarChart
                                data={horizontalBarData}
                                width={500}
                                height={400}
                            />
                        ) : (
                            <p className="text-gray-500">
                                No data available for this quarter.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Radar Chart Card */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Team Comparison
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Select
                                    value={filters.radarStartQuarter}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'radarStartQuarter',
                                            e.target.value as string
                                        )
                                    }
                                    size="small"
                                >
                                    {timePeriod.map((t) => (
                                        <MenuItem key={t} value={t}>
                                            {t}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <span>to</span>
                                <Select
                                    value={filters.radarEndQuarter}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'radarEndQuarter',
                                            e.target.value as string
                                        )
                                    }
                                    size="small"
                                >
                                    {timePeriod.map((t) => (
                                        <MenuItem key={t} value={t}>
                                            {t}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {isLoading.radar ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading...</p>
                            </div>
                        ) : radarData.length > 0 ? (
                            <RadarChart
                                data={radarData}
                                width={500}
                                height={400}
                            />
                        ) : (
                            <p className="text-gray-500">
                                No data available for selected quarters.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
