'use client'

import dynamic from "next/dynamic";
import type { ApexOptions } from 'apexcharts';
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import type { post } from '@prisma/client'
import { useEffect, useState } from "react";

interface ThemeChartProps {
    availableThemes: string[];
    postsWithSchedule: post[];
}

export function ThemeChart({ availableThemes, postsWithSchedule }: ThemeChartProps){
  const [availThemes, setAvailThemes] = useState(availableThemes);
  const [postsWithSched, setPostsWithSched] = useState(postsWithSchedule);
  const [themePostCounts, setThemePostCounts] = useState<number[]>([]);

  useEffect(() => {
    setAvailThemes(availableThemes);
    setPostsWithSched(postsWithSchedule);
    console.log("availThemes: ", availThemes.length);
    console.log("postsWithSched: ", postsWithSched.length);
  }
  , [availableThemes, postsWithSchedule]);

  useEffect(() => {
    const counts = availThemes.map(theme => {
      const count = postsWithSched.filter(post => post.created_from_theme === theme).length;
      console.log("theme: ", theme);
      console.log("count: ", count);
      return count;
    });
    setThemePostCounts(counts);
  }, [availThemes, postsWithSched]);



    // const themePostCounts = availThemes.map(theme => {
    //     const count = postsWithSched.filter(post => post.created_from_theme === theme).length;
    //     return count;
    //   });

    const option: ApexOptions = {
        chart: {
          id: 'theme-bar-chart'
        },
        xaxis: {
          categories: availThemes
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
        fill: {
            colors: ['#7070FF']
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