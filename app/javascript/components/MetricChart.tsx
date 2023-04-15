import { useQueries } from '@tanstack/react-query'
import { Spinner } from 'flowbite-react'
import _ from 'lodash'
import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { ChartKind } from '../queries/user/charts'
import { metricShowOptions } from '../queries/user/metrics'

const CHART_HEIGHT = 224

type ChartData = { [date: string]: number }

const kindToType = {
  area: 'area',
  line: 'line',
  stacked_area: 'area',
  stacked_percentage_area: 'area',
}

const buildSeries = (metrics, kind) => {
  const chartsData = metrics.map((metric) => metric.chart_data)
  if (chartsData.length > 1) fillGaps(chartsData)
  if (kind === ChartKind.StackedPercentageArea) toPercentages(chartsData)

  return toApexChartsData(metrics, chartsData)
}

const fillGaps = (chartsData: ChartData[]) => {
  const allDays = _.uniq(chartsData.flatMap((chartData) => Object.keys(chartData))).sort()
  chartsData.forEach((chartData) => {
    let previousValue = 0
    allDays.forEach((day) => {
      if (chartData[day] === undefined) chartData[day] = previousValue
      previousValue = chartData[day]
    })
  })
}
  
const toPercentages = (chartsData: ChartData[]) => {
  Object.keys(chartsData[0]).forEach((day) => {
    const total = chartsData.reduce((sum, serie) => sum + serie[day], 0)
    chartsData.forEach((serie) => (serie[day] = (serie[day] / total) * 100))
  })
}

const toApexChartsData = (metrics, chartsData: ChartData[]) =>
  chartsData.map((chartData, index) => ({
    name: metrics[index].name,
    data: _.sortBy(
      Object.entries(chartData).map(([day, value]) => ({
        x: day,
        y: value,
      })),
      'x'
    ),
  }))

interface Props {
  metricIds: number[]
  kind: ChartKind
  owners?: string[]
}

const MetricChart = ({ metricIds, kind, owners }: Props) => {
  const results = useQueries({ queries: metricIds.map((id) => metricShowOptions(id, owners)) })

  const metrics = results.map((result) => result.data)

  const isLoading = results.some((result) => result.isLoading)

  const series = useMemo(() => (metrics.every(Boolean) ? buildSeries(metrics, kind) : []), [metrics, kind])

  if (isLoading)
    return (
      <div className={`h-[${CHART_HEIGHT}px]`}>
        <Spinner />
      </div>
    )

  if (metricIds.length === 0) return null

  const options = {
    chart: {
      background: 'none',
      type: kindToType[kind],
      stacked: kind === 'stacked_area' || kind === 'stacked_percentage_area',
      animations: { enabled: false },
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    theme: { mode: 'dark', palette: 'palette6' },
    grid: { show: false },
    xaxis: { tickAmount: 6, labels: { show: true, rotate: 0 }, type: 'datetime' },
    yaxis: {
      min: 0,
      forceNiceScale: kind !== ChartKind.StackedPercentageArea,
      labels: {
        formatter: (value) =>
          kind === ChartKind.StackedPercentageArea ? value.toFixed(0).toString() + '%' : value.toFixed(0).toString(),
      },
      max: kind === ChartKind.StackedPercentageArea ? 100 : undefined,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
  }

  return <Chart type={kindToType[kind]} height={CHART_HEIGHT} options={options} series={series} />
}

export default MetricChart
