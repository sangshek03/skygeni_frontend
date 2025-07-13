'use client'
import { HorizontalBarData } from '@/app/(graph_pages)/team/page'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

interface HorizontalBarChartProps {
    data: HorizontalBarData[]
    width?: number
    height?: number
}

export default function HorizontalBarChart({
    data,
    width = 600,
    height = 400,
}: HorizontalBarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current) return

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove() // Clear previous chart

        const margin = { top: 20, right: 30, bottom: 40, left: 90 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        // Create chart group
        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        // Process data - combine both types (count and acv)
        const allTeams = [...data[0].teams] // Start with count data
        const acvData = data.find((d) => d.type === 'acv')?.teams || []

        // Create scales
        const x = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(allTeams, (d) =>
                    Math.max(
                        Number(d.value),
                        Number(
                            acvData.find((a) => a.name === d.name)?.value || 0
                        )
                    )
                ) as number,
            ])
            .range([0, innerWidth])

        const y = d3
            .scaleBand()
            .domain(allTeams.map((d) => d.name))
            .range([0, innerHeight])
            .padding(0.1)

        // Add count bars
        g.selectAll('.count-bar')
            .data(allTeams)
            .enter()
            .append('rect')
            .attr('class', 'count-bar fill-blue-500')
            .attr('x', 0)
            .attr('y', (d) => y(d.name) || 0)
            .attr('width', (d) => x(Number(d.value)))
            .attr('height', y.bandwidth())
            .attr('rx', 4)
            .attr('ry', 4)

        // Add ACV bars if available
        if (acvData.length > 0) {
            g.selectAll('.acv-bar')
                .data(acvData)
                .enter()
                .append('rect')
                .attr('class', 'acv-bar fill-green-500 opacity-70')
                .attr('x', 0)
                .attr('y', (d) => y(d.name) || 0)
                .attr('width', (d) => x(Number(d.value)))
                .attr('height', y.bandwidth() / 2)
                .attr('transform', `translate(0, ${y.bandwidth() / 2})`)
                .attr('rx', 4)
                .attr('ry', 4)
        }

        // Add axes
        g.append('g')
            .attr('class', 'axis-x')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))

        g.append('g').attr('class', 'axis-y').call(d3.axisLeft(y))

        // Add legend
        const legend = svg
            .append('g')
            .attr('transform', `translate(${width - 100}, 20)`)

        legend
            .append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', '#3b82f6')

        legend
            .append('text')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .text('Count')
            .style('font-size', '12px')

        if (acvData.length > 0) {
            legend
                .append('rect')
                .attr('y', 20)
                .attr('width', 18)
                .attr('height', 18)
                .attr('fill', '#10b981')
                .attr('opacity', 0.7)

            legend
                .append('text')
                .attr('x', 24)
                .attr('y', 29)
                .attr('dy', '.35em')
                .text('ACV')
                .style('font-size', '12px')
        }
    }, [data, width, height])

    return <svg ref={svgRef} width={width} height={height} />
}
