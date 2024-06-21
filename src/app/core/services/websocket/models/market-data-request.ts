import { ProviderType } from '@core/services/api-service/models/list-providers-data-view';

export type PriceType = 'ask' | 'bid' | 'last';

export interface MarketDataRequest {
  type: string;
  id: string;
  instrumentId: string;
  provider: ProviderType;
  subscribe: boolean;
  kinds: PriceType[];
}
