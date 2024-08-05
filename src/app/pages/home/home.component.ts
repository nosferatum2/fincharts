import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '@core/services/websocket/websocket.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstrumentsService } from '@shared/services/instruments/instruments.service';
import { InstrumentsDataPageView } from '@shared/services/instruments/models/instruments-data-page-view';
import { BarsService } from '@shared/services/bars/bars.service';
import { BarChartComponent } from '@shared/components/bar-chart/bar-chart.component';
import { ExchangesDataView } from '@shared/services/instruments/models/exchanges-data-view';
import { ExchangesQuery, InstrumentsQueryBuilder } from '@shared/services/instruments/queries/queries';
import { CountBackQuery } from '@shared/services/bars/queries/queries';
import { SubFormComponent } from '@pages/components/sub-form/sub-form.component';
import { CurrencyOption } from '@pages/models/currency-options';
import { AsyncPipe } from '@angular/common';

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
    BarChartComponent,
    SubFormComponent,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [
    BarsService
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  marketStream$: Observable<any>;

  instruments$: Observable<InstrumentsDataPageView>;

  exchanges$: Observable<ExchangesDataView>;

  bars$: Observable<any>;

  currencyOptions$ = new BehaviorSubject<CurrencyOption[]>([]);

  instrumentsQueryBuilder: InstrumentsQueryBuilder = new InstrumentsQueryBuilder();

  exchangeQueryBuilder: ExchangesQuery = new ExchangesQuery();

  countBackQueryBuilder = new CountBackQuery(
    'ad9e5345-4c3b-41fc-9437-1d253f62db52',
    'oanda',
    1,
    'hour',
    20
  );

  private subscription: Subscription;

  private destroyRef = inject(DestroyRef);

  constructor(
    private websocketService: WebsocketService,
    private instrumentsService: InstrumentsService,
    private barsService: BarsService
  ) {
  }

  ngOnInit() {
    this.marketStream$ = this.websocketService.getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef));

    this.instruments$ = this.instrumentsService.getInstruments(
      this.instrumentsQueryBuilder
    );
    // this.instruments$.subscribe(console.log);

    this.bars$ = this.barsService.getCountBack(this.countBackQueryBuilder);
    // this.bars$.subscribe(console.log);

    this.exchanges$ = this.instrumentsService.getExchanges(this.exchangeQueryBuilder);
    // this.exchanges$.subscribe(console.log);
  }

  public onInputChange(inputValue: string) {
    if (inputValue.length > 0) {
      this.subscription = this.instrumentsService.getInstruments(
        this.instrumentsQueryBuilder.withSymbol(inputValue)
      )
        .subscribe((instruments: InstrumentsDataPageView) =>
          this.currencyOptions$.next(this.transformInstruments(instruments))
        );
    } else {
      this.currencyOptions$.next([]);
    }
  }

  public onSubmit(option: CurrencyOption | null) {
    console.log(option);
    return option;
  }

  private transformInstruments(instruments: InstrumentsDataPageView): CurrencyOption[] {
    return instruments.data.map(instrument => ({
      id: instrument.id,
      value: instrument.symbol,
      label: instrument.description
    }));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
