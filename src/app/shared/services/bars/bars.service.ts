import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service/api.service';
import { TradeDataPageView } from '@shared/services/bars/models/trade-data-page-view';
import { CountBackQuery, DateRangeQuery, TimeBackQuery } from '@shared/services/bars/queries/queries';

const BASE_BARS_PATH = '/api/bars/v1';

const barsApi = {
  countBack: `${BASE_BARS_PATH}/bars/count-back`,
  dateRange: `${BASE_BARS_PATH}/bars/date-range`,
  timeBack: '/api/data-consolidators/bars/v1/bars/time-back',
};

@Injectable()
export class BarsService {

  private apiService = inject(ApiService);

  getCountBack(params: CountBackQuery) {
    return this.apiService.doGetRequest<TradeDataPageView>(barsApi.countBack, params);
  }

  getDateRange(params: DateRangeQuery) {
    return this.apiService.doGetRequest<TradeDataPageView>(barsApi.dateRange, params);
  }

  getTimeBack(params: TimeBackQuery) {
    return this.apiService.doGetRequest<any>(barsApi.timeBack, params);
  }

}
