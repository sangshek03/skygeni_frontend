'use client'
import { useEffect, useState } from 'react'
import { DonutChart } from '../../../components/charts/donut_chart'
import { SparklineChart } from '../../../components/charts/sparkline_chart'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'

const CustomerTypeDashboard = () => {
    const [donutData, setDonutData] = useState<any[]>([])
    const [sparklineData, setSparklineData] = useState<any[]>([])
    const [year, setYear] = useState('2024')
    const [quarter, setQuarter] = useState('Q2')
    const [loading, setLoading] = useState(false)

    const fetchDonutData = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                `http://localhost:3001/api/v1/analytics/customer-type/donut?quarter=${year}-${quarter}`
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const formatted = data.segments.map((item: any) => ({
                name: item.type,
                value: parseFloat(item.acv),
            }))
            setDonutData(formatted)
        } catch (error) {
            console.error('Error fetching donut data:', error)
            setDonutData([])
        } finally {
            setLoading(false)
        }
    }

    const fetchSparklineData = async () => {
        try {
            const response = await fetch(
                'http://localhost:3001/api/v1/analytics/customer-type/sparkline'
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setSparklineData(data)
        } catch (error) {
            console.error('Error fetching sparkline data:', error)
            setSparklineData([])
        }
    }

    useEffect(() => {
        fetchDonutData()
        fetchSparklineData()
    }, [year, quarter])

    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {/* Donut Chart */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Typography variant="h6">
                                    Customer Type Donut
                                </Typography>
                                <Box display="flex" gap={2}>
                                    <FormControl size="small">
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={year}
                                            onChange={(e) =>
                                                setYear(e.target.value)
                                            }
                                            label="Year"
                                        >
                                            <MenuItem value="2023">
                                                2023
                                            </MenuItem>
                                            <MenuItem value="2024">
                                                2024
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small">
                                        <InputLabel>Quarter</InputLabel>
                                        <Select
                                            value={quarter}
                                            onChange={(e) =>
                                                setQuarter(e.target.value)
                                            }
                                            label="Quarter"
                                        >
                                            <MenuItem value="Q1">Q1</MenuItem>
                                            <MenuItem value="Q2">Q2</MenuItem>
                                            <MenuItem value="Q3">Q3</MenuItem>
                                            <MenuItem value="Q4">Q4</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            {donutData.length > 0 ? (
                                <DonutChart data={donutData} />
                            ) : (
                                <Typography variant="body2">
                                    No data for selected quarter.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sparkline Chart */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" mb={2}>
                                Customer Type Trend (Sparkline)
                            </Typography>
                            {sparklineData.length > 0 ? (
                                <SparklineChart data={sparklineData} />
                            ) : (
                                <Typography variant="body2">
                                    No trend data available.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CustomerTypeDashboard
