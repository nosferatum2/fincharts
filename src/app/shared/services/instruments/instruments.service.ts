import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service/api.service';
import { InstrumentsDataPageView } from '@shared/services/instruments/models/instruments-data-page-view';
import { ProvidersDataView } from '@shared/services/instruments/models/providers-data-view';
import { ExchangesDataView } from '@shared/services/instruments/models/exchanges-data-view';

const BASE_INSTRUMENTS_PATH = '/api/instruments/v1';

const instrumentsApi = {
  instruments: `${BASE_INSTRUMENTS_PATH}/instruments`,
  providers: `${BASE_INSTRUMENTS_PATH}/providers`,
  exchanges: `${BASE_INSTRUMENTS_PATH}/exchanges`
};

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {

  private apiService = inject(ApiService);

  getInstruments(params?: any) {
    return this.apiService.doGetRequest<InstrumentsDataPageView>(instrumentsApi.instruments, params);
  }

  getProviders(params?: any) {
    return this.apiService.doGetRequest<ProvidersDataView>(instrumentsApi.providers, params);
  }

  getExchanges(params?: any) {
    return this.apiService.doGetRequest<ExchangesDataView>(instrumentsApi.exchanges, params);
  }

}
