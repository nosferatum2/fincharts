import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from '@core/services/websocket/websocket.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InstrumentsDataPageView } from '@core/services/api-service/models/instruments-data-page-view';
import { ApiService } from '@core/services/api-service/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, JsonPipe } from '@angular/common';

// const marketDataRequest: MarketDataRequest = {
//   type: 'l1-subscription',
//   id: '1',
//   instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
//   provider: 'simulation',
//   subscribe: true,
//   kinds: ['ask', 'bid', 'last']
// };

export const INSTRUMENTS_URL = '/api/instruments/v1/instruments?provider=oanda&kind=forex';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  marketStream$: Observable<any>;

  instruments$: Observable<InstrumentsDataPageView>;

  subscriptionForm: FormGroup = this.formBuilder.group({
    subscription: ['', Validators.required]
  });

  private destroyRef = inject(DestroyRef);

  constructor(
    private websocketService: WebsocketService,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.instruments$ = this.apiService.doGetRequest<InstrumentsDataPageView>(INSTRUMENTS_URL);
  }

  ngOnInit() {
    this.marketStream$ = this.websocketService.getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef));

    // this.instruments$.subscribe(console.log);
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      console.log(this.subscriptionForm.value);
      this.apiService.doGetRequest(INSTRUMENTS_URL).subscribe();

      // this.websocketService.sendMessage(marketDataRequest);
    }
  }

}
