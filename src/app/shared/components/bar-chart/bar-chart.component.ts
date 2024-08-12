import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, TooltipItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { mockData } from '@shared/components/bar-chart/mock.data';
// import { StreamingPlugin } from 'chartjs-plugin-streaming';
import 'chartjs-chart-financial';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {

  data = mockData.map(item => {
    return {
      x: new Date(item.x).valueOf(), // item.x,
      o: item.o,
      h: item.h,
      l: item.l,
      c: item.c,
      v: item.v
    };
  });

  chartData: ChartDataset<'candlestick'>[] = [
    {
      data: this.data,
      label: 'Series 1',
    }
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index',
        callbacks: {
          label: function (context: TooltipItem<'candlestick'>) {
            const data = context.raw as any;
            return `Open: ${data.o}, High: ${data.h}, Low: ${data.l}, Close: ${data.c}, Volume: ${data.v}`;
          }
        }
      },
      // streaming: {
      //   duration: 20000, // duration of the chart in milliseconds
      //   refresh: 1000, // refresh interval in milliseconds
      // }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      }
    }
  };

  chartPlugins = [];

  chartLegend = true;

  chartType: ChartType = 'candlestick';

}
