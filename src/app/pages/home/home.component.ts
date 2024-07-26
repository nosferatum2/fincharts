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
import { ExchangesDataView } from '@shared/services/instruments/models/exchanges-data-view';
import { ExchangesQuery, InstrumentsQueryBuilder } from '@shared/services/instruments/queries/queries';
import { BarsQueryBuilder, CountBackQuery } from '@shared/services/bars/queries/queries';

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

  exchanges$: Observable<ExchangesDataView>;

  bars$: Observable<any>;

  subscriptionForm: FormGroup = this.formBuilder.group({
    subscription: ['', Validators.required]
  });

  instrumentsQueryBuilder: InstrumentsQueryBuilder = new InstrumentsQueryBuilder();

  exchangeQueryBuilder: ExchangesQuery = new ExchangesQuery();

  countBackQueryBuilder = new BarsQueryBuilder<CountBackQuery>({
    instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
    provider: 'oanda',
    interval: 1,
    periodicity: 'hour',
    barsCount: 20
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

    this.instruments$ = this.instrumentsService.getInstruments(
      this.instrumentsQueryBuilder
        .withPaging(1, 10)
    );
    // this.instruments$.subscribe(console.log);

    this.bars$ = this.barsService.getCountBack(this.countBackQueryBuilder.build());
    this.bars$.subscribe(console.log);

    this.exchanges$ = this.instrumentsService.getExchanges(this.exchangeQueryBuilder);
    // this.exchanges$.subscribe(console.log);
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      console.log(this.subscriptionForm.value);
      // this.apiService.doGetRequest(INSTRUMENTS_URL).subscribe();

      // this.websocketService.sendMessage(marketDataRequest);
    }
  }

}
