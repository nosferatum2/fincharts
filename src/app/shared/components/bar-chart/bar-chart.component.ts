import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { mockData } from '@shared/components/bar-chart/mock.data';

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

  chartData: ChartDataset<'candlestick'>[] = [
    {
      data: mockData.map(item => {
        return {
          x: new Date(item.x).valueOf(), // item.x,
          o: item.o,
          h: item.h,
          l: item.l,
          c: item.c
        };
      }),
      label: 'Series 1',
      type: 'candlestick'
    }
  ];

  chartOptions: ChartOptions = {
    responsive: true,
  };

  chartPlugins = [];

  chartLegend = true;

  chartType: ChartType = 'candlestick';

}
