'use client'

import dynamic from "next/dynamic";
import type { ApexOptions } from 'apexcharts';
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


export function ExampleChart(){

    const option: ApexOptions = {
        chart: {
          id: 'apexchart-example'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
      }

    const series = [{
        name: 'series-1',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }]

    return(
        <>
            <ApexChart type="bar" options={option} series={series} height={200} width={500} />
        </>
    )
    
}