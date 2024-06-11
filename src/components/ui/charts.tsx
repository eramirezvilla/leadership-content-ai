'use client'

import dynamic from "next/dynamic";
import type { ApexOptions } from 'apexcharts';
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import type { post } from '@prisma/client'

interface ThemeChartProps {
    availableThemes: string[];
    postsWithSchedule: post[];
}

export function ThemeChart({ availableThemes, postsWithSchedule }: ThemeChartProps){
    const themePostCounts = availableThemes.map(theme => {
        const count = postsWithSchedule.filter(post => post.created_from_theme === theme).length;
        return count;
      });

    const option: ApexOptions = {
        chart: {
          id: 'theme-bar-chart'
        },
        xaxis: {
          categories: availableThemes
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
        fill: {
            colors: ['#3AAFB9']
        },
      }

    const series = [{
        name: 'Number of Posts',
        data: themePostCounts
      }]

    return(
        <>
            <ApexChart type="bar" options={option} series={series} height={500} width={500} />
        </>
    )
    
}