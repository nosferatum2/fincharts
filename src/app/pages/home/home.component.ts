import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '@core/services/websocket/websocket.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstrumentsService } from '@shared/services/instruments/instruments.service';
import { InstrumentsDataPageView } from '@shared/services/instruments/models/instruments-data-page-view';
import { BarsService } from '@shared/services/bars/bars.service';
import { BarChartComponent } from '@shared/components/bar-chart/bar-chart.component';

// const marketDataRequest: MarketDataRequest = {
//   type: 'l1-subscription',
//   id: '1',
//   instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
//   provider: 'simulation',
//   subscribe: true,
//   kinds: ['ask', 'bid', 'last']
// };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    BarChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [
    BarsService
  ]
})
export class HomeComponent implements OnInit {

  marketStream$: Observable<any>;

  instruments$: Observable<InstrumentsDataPageView>;

  bars$: Observable<any>;

  subscriptionForm: FormGroup = this.formBuilder.group({
    subscription: ['', Validators.required]
  });

  private destroyRef = inject(DestroyRef);

  constructor(
    private websocketService: WebsocketService,
    private formBuilder: FormBuilder,
    private instrumentsService: InstrumentsService,
    private barsService: BarsService
  ) {
  }

  ngOnInit() {
    this.marketStream$ = this.websocketService.getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef));

    this.instruments$ = this.instrumentsService.getInstruments();
    // this.instruments$.subscribe(console.log);

    // bars count back
    this.bars$ = this.barsService.getCountBack({
      instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
      provider: 'oanda',
      interval: 1,
      periodicity: 'minute',
      barsCount: 10
    });

    // bars date range
    // this.bars$ = this.barsService.getDateRange({
    //   instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
    //   provider: 'oanda',
    //   interval: 1,
    //   periodicity: 'hour',
    //   startDate: '2023-09-07',
    //   endDate: '2023-09-30'
    // });

    // bars time back
    // this.bars$ = this.barsService.getTimeBack({
    //   // instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
    //   // provider: 'oanda',
    //   // interval: 1,
    //   // periodicity: 'minute',
    //   // timeBack: '1.00:00:00',
    // });

    this.bars$.subscribe(console.log);
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      console.log(this.subscriptionForm.value);
      // this.apiService.doGetRequest(INSTRUMENTS_URL).subscribe();

      // this.websocketService.sendMessage(marketDataRequest);
    }
  }

}
