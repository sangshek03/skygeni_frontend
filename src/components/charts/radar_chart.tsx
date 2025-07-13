'use client'
import { RadarData } from '@/app/(graph_pages)/team/page'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

interface RadarChartProps {
    data: RadarData[]
    width?: number
    height?: number
}

export default function RadarChart({
    data,
    width = 500,
    height = 500,
}: RadarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current) return

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove() // Clear previous chart

        const margin = { top: 40, right: 40, bottom: 40, left: 40 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom
        const radius = Math.min(innerWidth, innerHeight) / 2

        // Filter out empty quarters
        const validData = data.filter((d) => d.metrics.length > 0)
        if (validData.length === 0) return

        // Get all metric names
        const metricNames = validData[0].metrics.map((m) => m.name)

        // Create scales
        const maxCount = d3.max(
            validData.flatMap((d) => d.metrics.map((m) => m.count))
        ) as number
        const maxAcv = d3.max(
            validData.flatMap((d) => d.metrics.map((m) => parseFloat(m.acv)))
        ) as number

        const rScaleCount = d3
            .scaleLinear()
            .domain([0, maxCount])
            .range([0, radius])
        const rScaleAcv = d3
            .scaleLinear()
            .domain([0, maxAcv])
            .range([0, radius])

        // Create chart group
        const g = svg
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)

        // Create axes
        const angleSlice = (Math.PI * 2) / metricNames.length

        // Draw axes
        metricNames.forEach((name, i) => {
            const angle = angleSlice * i - Math.PI / 2
            const line = d3.line()([
                [0, 0],
                [radius * Math.cos(angle), radius * Math.sin(angle)],
            ])
            g.append('path')
                .attr('d', line)
                .attr('stroke', '#ccc')
                .attr('stroke-width', 1)

            // Add axis labels
            g.append('text')
                .attr('class', 'text-xs')
                .attr('x', (radius + 10) * Math.cos(angle))
                .attr('y', (radius + 10) * Math.sin(angle))
                .attr('text-anchor', 'middle')
                .text(name)
        })

        // Draw concentric circles
        const levels = 5
        for (let level = 1; level <= levels; level++) {
            const levelRadius = (radius * level) / levels
            g.append('circle')
                .attr('r', levelRadius)
                .attr('fill', 'none')
                .attr('stroke', '#ccc')
                .attr('stroke-width', 0.5)
        }

        // Create color scale
        const color = d3
            .scaleOrdinal()
            .domain(validData.map((d) => d.quarter))
            .range(d3.schemeCategory10)

        // Draw data for each quarter
        validData.forEach((quarterData) => {
            // Count polygon
            const countLine = d3
                .lineRadial()
                .curve(d3.curveLinearClosed)
                .radius((d: any) => rScaleCount(d.count))
                .angle((d: any, i) => angleSlice * i - Math.PI / 2)

            g.append('path')
                .datum(quarterData.metrics)
                // @ts-ignore
                .attr('d', countLine)
                .attr('stroke', color(quarterData.quarter) as string)
                .attr('stroke-width', 2)
                .attr('fill', color(quarterData.quarter) as string)
                .attr('fill-opacity', 0.1)
                .attr('class', 'count-polygon')

            // ACV polygon
            const acvLine = d3
                .lineRadial()
                .curve(d3.curveLinearClosed)
                .radius((d: any) => rScaleAcv(parseFloat(d.acv)))
                .angle((d: any, i) => angleSlice * i - Math.PI / 2)

            g.append('path')
                .datum(quarterData.metrics)
                // @ts-ignore
                .attr('d', acvLine)
                .attr('stroke', color(quarterData.quarter) as string)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '3,3')
                .attr('fill', 'none')
                .attr('class', 'acv-polygon')
        })

        // Add legend
        const legend = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        validData.forEach((quarterData, i) => {
            const legendItem = legend
                .append('g')
                .attr('transform', `translate(0, ${i * 20})`)

            legendItem
                .append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', color(quarterData.quarter) as string)

            legendItem
                .append('text')
                .attr('x', 20)
                .attr('y', 9)
                .attr('dy', '.35em')
                .text(`${quarterData.quarter} (Solid: Count, Dashed: ACV)`)
                .style('font-size', '12px')
        })
    }, [data, width, height])

    return <svg ref={svgRef} width={width} height={height} />
}
